import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilialService, FilialDTO } from '../../services/filial.service';
import { DuplicataService } from '../../services/duplicata.service';

@Component({
  selector: 'app-protocolo-conta-paga',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './protocolo-conta-paga.component.html',
  styleUrls: ['./protocolo-conta-paga.component.css']
})
export class ProtocoloContaPagaComponent implements OnInit {

  filiais: FilialDTO[] = [];
  filialSelecionada: number | null = null;

  dataInicial: string = '';
  dataFinal: string = '';

  carregando = false;
  parcelas: any[] = [];

  constructor(
    private readonly filialService: FilialService,
    private readonly duplicataService: DuplicataService
  ) {}

  ngOnInit(): void {
    this.carregarFiliais();
  }

  carregarFiliais(): void {
    this.filialService.listarFiliais().subscribe({
      next: (res) => {
        this.filiais = res.resposta ?? res;
      },
      error: (err) => console.error('Erro ao carregar filiais:', err)
    });
  }

  gerarRelatorio(): void {
    if (!this.filialSelecionada || !this.dataInicial || !this.dataFinal) {
      alert("Selecione filial e datas.");
      return;
    }

    this.carregando = true;

    this.duplicataService
      .obterRelatorioParcelasPagasPorTipo(
        this.filialSelecionada,
        this.dataInicial,
        this.dataFinal
      )
      .subscribe({
        next: (res) => {
          this.parcelas = res?.resposta ?? [];
          this.carregando = false;
        },
        error: (err) => {
          console.error("Erro ao buscar relatório:", err);
          this.parcelas = [];
          this.carregando = false;
        }
      });
  }



  gerarRelatorioPDF(): void {
    if (!this.filialSelecionada || !this.dataInicial || !this.dataFinal) {
      alert('Selecione a filial e o período.');
      return;
    }

    this.duplicataService
      .gerarRelatorioParcelasPagasPorTipoPDF(
        this.filialSelecionada,
        this.dataInicial,
        this.dataFinal
      )
      .subscribe({
        next: (pdfBlob) => {
          const blob = new Blob([pdfBlob], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
        },
        error: (err) => {
          console.error('Erro ao gerar PDF:', err);
          alert('Erro ao gerar relatório PDF.');
        }
      });
  }
}
