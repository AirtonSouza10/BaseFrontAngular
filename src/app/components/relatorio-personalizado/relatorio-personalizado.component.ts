import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

import { DuplicataService } from '../../services/duplicata.service';
import { FilialService } from '../../services/filial.service';
import { FornecedorService } from '../../services/fornecedor.service';
import { SituacaoService } from '../../services/situacao.service';
import { TipoNotaService } from '../../services/tipo-nota.service';
import { TipoDuplicataService } from '../../services/tipo-duplicata.service';
import { TipoPagamentoService } from '../../services/tipo-pagamento.service';

@Component({
  selector: 'app-relatorio-personalizado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './relatorio-personalizado.component.html',
  styleUrls: ['./relatorio-personalizado.component.css']
})
export class RelatorioPersonalizadoComponent implements OnInit {

  filtro: any = {
    idFilial: null,
    idStatusConta: null,
    idFornecedor: null,
    idTipoNota: null,
    idTipoDuplicata: null,
    idTipoPagamento: null,
    dataInicial: null,
    dataFinal: null
  };

  filiais: any[] = [];
  fornecedores: any[] = [];
  situacoes: any[] = [];
  tiposNota: any[] = [];
  tiposDuplicata: any[] = [];
  tiposPagamento: any[] = [];

  relatorio: any[] = [];
  carregando = false;
  mostrouResultado = false;  // controla exibição da mensagem de vazio

  constructor(
    private filialService: FilialService,
    private fornecedorService: FornecedorService,
    private situacaoService: SituacaoService,
    private tipoNotaService: TipoNotaService,
    private tipoDuplicataService: TipoDuplicataService,
    private tipoPagamentoService: TipoPagamentoService,
    private duplicataService: DuplicataService
  ) {}

  ngOnInit(): void {
    this.carregarFiltros();
  }

  carregarFiltros(): void {
    this.filialService.listarFiliais().subscribe(r => this.filiais = r.resposta);
    this.fornecedorService.listar().subscribe(r => this.fornecedores = r.resposta);
    this.situacaoService.listarSituacoes().subscribe(r => this.situacoes = r.resposta);
    this.tipoNotaService.listarTiposNota().subscribe(r => this.tiposNota = r.resposta);
    this.tipoDuplicataService.listarTipos().subscribe(r => this.tiposDuplicata = r.resposta);
    this.tipoPagamentoService.listarTiposPagamento().subscribe(r => this.tiposPagamento = r.resposta);
  }

  gerarRelatorio(): void {
    this.carregando = true;
    this.mostrouResultado = false;
    this.relatorio = [];  // limpa antes de nova busca

    this.duplicataService.obterRelatorioCustomizado(this.filtro)
      .subscribe({
        next: (res) => {
          this.relatorio = res.resposta || [];
          this.carregando = false;
          this.mostrouResultado = true;
        },
        error: (err) => {
          console.error(err);
          this.carregando = false;
          this.mostrouResultado = true;
        }
      });
  }

  gerarPDF(): void {
    this.duplicataService.gerarRelatorioCustomizadoPDF(this.filtro)
      .subscribe({
        next: (pdf) => {
          const blob = new Blob([pdf], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
        },
        error: (err) => console.error(err)
      });
  }
}
