import { Component, OnInit } from '@angular/core';
import { NotaFiscalDTO, NotaFiscalService, ParcelaPrevistaNotaDTO } from '../../services/nota-fiscal.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-consulta-nota',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consulta-nota.component.html',
  styleUrls: ['./consulta-nota.component.css']
})
export class ConsultaNotaComponent implements OnInit {

  termo: string = '';
  resultados: NotaFiscalDTO[] = [];
  pesquisado: boolean = false;
  pagina: number = 0;
  size: number = 20;
  totalPages: number = 0;

  parcelasPrevistas: ParcelaPrevistaNotaDTO[] = [];
  notaSelecionada: NotaFiscalDTO | null = null;

  constructor(private readonly notaService: NotaFiscalService) {}

  ngOnInit(): void {}

  pesquisar(): void {
    if (!this.termo) return;

    this.notaService.listarPorNumero(this.termo, this.pagina, this.size).subscribe((res: any) => {
      const resposta = res.resposta;
      this.resultados = resposta?.content || [];
      this.totalPages = resposta?.totalPages || 0;
      this.pesquisado = true;
    }, (error) => {
      console.error('Erro ao buscar notas fiscais', error);
      this.resultados = [];
      this.totalPages = 0;
      this.pesquisado = true;
    });
  }

  verPrevistas(nota: NotaFiscalDTO): void {
    this.notaSelecionada = nota;
    this.notaService.listarParcelasPrevistas(nota.id!).subscribe((res: any) => {
      const resposta = res.resposta;
      this.parcelasPrevistas = resposta || [];
    }, (error) => {
      console.error('Erro ao buscar parcelas previstas', error);
      this.parcelasPrevistas = [];
    });
  }

  fecharPrevistas(): void {
    this.notaSelecionada = null;
    this.parcelasPrevistas = [];
  }

  paginaAnterior(): void {
    if (this.pagina > 0) { this.pagina--; this.pesquisar(); }
  }

  proximaPagina(): void {
    if (this.pagina < this.totalPages - 1) { this.pagina++; this.pesquisar(); }
  }

  irParaPagina(p: number): void {
    this.pagina = p;
    this.pesquisar();
  }

  // Retorna um array com as páginas visíveis, limitando a quantidade de botões
  getPaginasVisiveis(): number[] {
    const total = this.totalPages;
    const maxButtons = 5; // máximo de botões exibidos
    let start = Math.max(this.pagina - 2, 0);
    let end = Math.min(start + maxButtons, total);

    if (end - start < maxButtons) {
      start = Math.max(end - maxButtons, 0);
    }

    return Array.from({ length: end - start }, (_, i) => start + i);
  }
}
