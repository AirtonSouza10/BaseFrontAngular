import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DuplicataService } from '../../services/duplicata.service';
import { BaixarParcelaComponent } from '../baixar-parcela/baixar-parcela.component';
import { SituacaoService } from '../../services/situacao.service';
import { TipoPagamentoService } from '../../services/tipo-pagamento.service';

@Component({
  selector: 'app-consulta-geral',
  standalone: true,
  imports: [CommonModule, FormsModule, BaixarParcelaComponent],
  templateUrl: './consulta-geral.component.html',
  styleUrls: ['./consulta-geral.component.css']
})
export class ConsultaGeralComponent {

  termo = '';
  resultados: any[] = [];

  pagina = 0;
  tamanho = 10;
  totalPages = 0;

  pesquisado = false;
  parcelaSelecionada: any = null;
  parcelaEdicao: any = null;

  situacoes: any[] = [];
  tiposPagamento: any[] = [];

  form: any = {};

  constructor(
    private duplicataService: DuplicataService,
    private situacaoService: SituacaoService,
    private tipoPagamentoService: TipoPagamentoService
  ) {}

  pesquisar() {
    this.pagina = 0;
    this.buscar();
  }

  private buscar() {
    this.duplicataService.buscarGeral(this.termo, this.pagina, this.tamanho).subscribe({
      next: res => {
        const page = res?.resposta;
        this.resultados = page?.content || [];
        this.totalPages = page?.totalPages || 0;
        this.pesquisado = true;
      }
    });
  }

  // PAGINAÇÃO
  paginaAnterior() { if (this.pagina > 0) { this.pagina--; this.buscar(); } }
  proximaPagina() { if (this.pagina < this.totalPages - 1) { this.pagina++; this.buscar(); } }
  irParaPagina(p: number) { this.pagina = p; this.buscar(); }

  //  PAGINAÇÃO COM JANELA (ANTI-ESTOURO)
  getPaginasVisiveis(): number[] {
    const maxPaginas = 5;
    const metade = Math.floor(maxPaginas / 2);

    let inicio = this.pagina - metade;
    let fim = this.pagina + metade;

    if (inicio < 0) {
      inicio = 0;
      fim = maxPaginas - 1;
    }

    if (fim >= this.totalPages) {
      fim = this.totalPages - 1;
      inicio = Math.max(0, fim - maxPaginas + 1);
    }

    const paginas: number[] = [];
    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }

    return paginas;
  }

  // BAIXA
  abrirBaixa(parcela: any) {
    this.parcelaSelecionada = {
      ...parcela,
      id: parcela.parcelaId,
      descricao: parcela.descricaoDuplicata
    };
  }

  fecharBaixa() {
    this.parcelaSelecionada = null;
    this.buscar();
  }

  // EDIÇÃO
  abrirEdicao(parcela: any) {
    this.parcelaEdicao = parcela;

    this.form = {
      numeroParcela: parcela.numeroParcela,
      valorTotal: parcela.valorTotal,
      dtVencimento: parcela.dtVencimento?.substring(0, 10),
      dtPagamento: parcela.dtPagamento?.substring(0, 10),
      observacao: parcela.observacao,
      valorPago: parcela.valorPago,
      statusId: parcela.statusId,
      tipoPagamentoId: parcela.tipoPagamentoId
    };

    this.carregarStatus();
    this.carregarTipos();
  }

  fecharEdicao() {
    this.parcelaEdicao = null;
  }

  salvarEdicao() {
    this.duplicataService.atualizarParcela(this.parcelaEdicao.parcelaId, this.form).subscribe({
      next: () => {
        alert('Parcela atualizada com sucesso');
        this.fecharEdicao();
        this.buscar();
      },
      error: () => alert('Erro ao atualizar parcela')
    });
  }

  // LOADERS
  carregarStatus() {
    this.situacaoService.listarSituacoes().subscribe(res => {
      this.situacoes = res?.resposta || res || [];
    });
  }

  carregarTipos() {
    this.tipoPagamentoService.listarTiposPagamento().subscribe(res => {
      this.tiposPagamento = res?.resposta || res || [];
    });
  }
}
