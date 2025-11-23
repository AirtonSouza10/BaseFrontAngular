import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DuplicataService } from '../../services/duplicata.service';
import { BaixarParcelaComponent } from '../baixar-parcela/baixar-parcela.component';

@Component({
  selector: 'app-consulta-geral',
  standalone: true,
  imports: [CommonModule, FormsModule, BaixarParcelaComponent],
  templateUrl: './consulta-geral.component.html',
  styleUrls: ['./consulta-geral.component.css']
})
export class ConsultaGeralComponent {
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
    this.duplicataService.buscarGeral(this.termo, this.pagina, this.tamanho)
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

  // Retorna apenas páginas visíveis
  getPaginasVisiveis(): number[] {
    const paginas: number[] = [];
    const maxVisiveis = 5;
    let inicio = Math.max(0, this.pagina - 2);
    let fim = Math.min(this.totalPages - 1, inicio + maxVisiveis - 1);

    if (fim - inicio < maxVisiveis - 1) {
      inicio = Math.max(0, fim - maxVisiveis + 1);
    }

    for (let i = inicio; i <= fim; i++) paginas.push(i);
    return paginas;
  }

  // MODAL BAIXAR
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
}
