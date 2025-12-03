import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotaFiscalService, ParcelaPrevistaResponseDTO } from '../../services/nota-fiscal.service';
import { NgForOf, DecimalPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-parcelas-previstas',
  standalone: true,
  imports: [CommonModule, NgForOf, DecimalPipe, DatePipe],
  templateUrl: './parcelas-previstas.component.html',
  styleUrls: ['./parcelas-previstas.component.css']
})
export class ParcelasPrevistasComponent implements OnInit {

  parcelasPrevistas: ParcelaPrevistaResponseDTO[] = [];
  carregando = true;
  erroMsg: string | null = null;

  // Controle de paginação
  pagina = 0;
  tamanho = 20;
  totalElementos = 0;
  totalPaginas = 0;

  constructor(private readonly notaFiscalService: NotaFiscalService) {}

  ngOnInit(): void {
    this.carregarParcelasPrevistas();
  }

  carregarParcelasPrevistas(): void {
    this.carregando = true;
    this.notaFiscalService.listarParcelasPrevistasPaginadas(this.pagina, this.tamanho).subscribe({
      next: res => {
        const page = res?.resposta;

        this.parcelasPrevistas = page?.content || [];
        this.totalElementos = page?.totalElements || 0;
        this.totalPaginas = page?.totalPages || 0;

        this.carregando = false;
      },
      error: () => {
        this.erroMsg = 'Erro ao carregar parcelas previstas';
        this.carregando = false;
      }
    });
  }

  // Avançar página
  proximaPagina(): void {
    if (this.pagina < this.totalPaginas - 1) {
      this.pagina++;
      this.carregarParcelasPrevistas();
    }
  }

  // Voltar página
  paginaAnterior(): void {
    if (this.pagina > 0) {
      this.pagina--;
      this.carregarParcelasPrevistas();
    }
  }

  // Ir direto para página
  irParaPagina(p: number): void {
    this.pagina = p;
    this.carregarParcelasPrevistas();
  }

  // JANELA DE PAGINAÇÃO
  getPaginasVisiveis(): number[] {
    const maxPaginas = 5;
    const metade = Math.floor(maxPaginas / 2);

    let inicio = this.pagina - metade;
    let fim = this.pagina + metade;

    if (inicio < 0) {
      inicio = 0;
      fim = maxPaginas - 1;
    }

    if (fim >= this.totalPaginas) {
      fim = this.totalPaginas - 1;
      inicio = Math.max(0, fim - maxPaginas + 1);
    }

    const paginas: number[] = [];
    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }

    return paginas;
  }
}
