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
  tamanho = 30;
  totalElementos = 0;

  constructor(private readonly notaFiscalService: NotaFiscalService) {}

  ngOnInit(): void {
    this.carregarParcelasPrevistas();
  }

  carregarParcelasPrevistas(): void {
    this.carregando = true;
    this.notaFiscalService.listarParcelasPrevistasPaginadas(this.pagina, this.tamanho).subscribe({
      next: res => {
        this.parcelasPrevistas = res?.content || []; // ajusta para o padrão Page do Spring
        this.totalElementos = res?.totalElements || 0;
        this.carregando = false;
      },
      error: err => {
        this.erroMsg = 'Erro ao carregar parcelas previstas';
        this.carregando = false;
      }
    });
  }

  // Avançar página
  proximaPagina(): void {
    if ((this.pagina + 1) * this.tamanho < this.totalElementos) {
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
}
