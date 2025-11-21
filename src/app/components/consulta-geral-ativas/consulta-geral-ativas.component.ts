import { Component } from '@angular/core';
import { DuplicataService } from '../../services/duplicata.service';
import { BaixarParcelaComponent } from "../baixar-parcela/baixar-parcela.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-consulta-geral-ativas',
  standalone: true,
  imports: [CommonModule, FormsModule,BaixarParcelaComponent],
  templateUrl: './consulta-geral-ativas.component.html',
  styleUrl: './consulta-geral-ativas.component.css'
})
export class ConsultaGeralAtivasComponent {
  termo: string = '';
  resultados: any[] = [];

  // Paginação
  pagina = 0;
  tamanho = 10;
  totalPages = 0;
  totalElements = 0;
  paginas: number[] = [];

  pesquisado = false;

  // Modal de baixar
  parcelaSelecionada: any = null;

  constructor(private readonly duplicataService: DuplicataService) {}

  pesquisar() {
    if (!this.termo.trim()) {
      this.limpar();
      this.pesquisado = true;
      return;
    }
    this.pagina = 0;
    this.buscar();
  }

  private buscar() {
    this.duplicataService.buscarGeralAtivas(this.termo, this.pagina, this.tamanho)
      .subscribe({
        next: res => {
          const page = res?.resposta;
          this.resultados = page?.content || [];
          this.totalPages = page?.totalPages || 0;
          this.totalElements = page?.totalElements || 0;
          this.paginas = Array.from({ length: this.totalPages }, (_, i) => i);
          this.pesquisado = true;
        },
        error: () => {
          this.resultados = [];
          this.totalPages = 0;
          this.totalElements = 0;
          this.paginas = [];
          this.pesquisado = true;
        }
      });
  }

  // PAGINAÇÃO
  paginaAnterior() { if (this.pagina > 0) { this.pagina--; this.buscar(); } }
  proximaPagina() { if (this.pagina < this.totalPages - 1) { this.pagina++; this.buscar(); } }
  irParaPagina(p: number) { this.pagina = p; this.buscar(); }

  limpar() {
    this.termo = '';
    this.resultados = [];
    this.pagina = 0;
    this.totalPages = 0;
    this.totalElements = 0;
    this.paginas = [];
    this.pesquisado = false;
  }

  getPaginasVisiveis(): number[] {
    const paginas: number[] = [];
    const inicio = Math.max(0, this.pagina - 2);
    const fim = Math.min(this.totalPages - 1, this.pagina + 2);
    for (let i = inicio; i <= fim; i++) paginas.push(i);
    return paginas;
  }

  // MODAL BAIXAR
  abrirBaixa(parcela: any) {
    this.parcelaSelecionada = {
      ...parcela,
      id: parcela.parcelaId,           // cria o id esperado pelo modal
      descricao: parcela.descricaoDuplicata // opcional: padroniza descrição
    };
  }
  fecharBaixa() { this.parcelaSelecionada = null; this.buscar(); }
}
