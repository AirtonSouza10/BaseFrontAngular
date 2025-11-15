import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilialService, FilialDTO } from '../../services/filial.service';
import { NotaFiscalService } from '../../services/nota-fiscal.service';

@Component({
  selector: 'app-protocolo-nota',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './protocolo-nota.component.html',
  styleUrls: ['./protocolo-nota.component.css']
})
export class ProtocoloNotaComponent implements OnInit {

  filiais: FilialDTO[] = [];
  filialSelecionada: number | null = null;

  dataInicial: string = '';
  dataFinal: string = '';

  carregando = false;
  notas: any[] = [];

  constructor(
    private readonly filialService: FilialService,
    private readonly notaFiscalService: NotaFiscalService
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
      this.carregando = true;

      this.notaFiscalService
        .listarPorFilialEPeriodo(this.filialSelecionada, this.dataInicial, this.dataFinal)
        .subscribe({
          next: (res) => {

            this.notas = res?.resposta?.notaFiscal ?? [];

            this.carregando = false;
          },
          error: (err) => {
            console.error("Erro ao buscar relatório:", err);
            this.notas = [];
            this.carregando = false;
          }
        });
    }


  gerarRelatorioPDF(): void {
    if (!this.dataInicial || !this.dataFinal) {
      alert('Selecione o período.');
      return;
    }

    this.notaFiscalService
      .gerarRelatorioPDF(this.filialSelecionada, this.dataInicial, this.dataFinal)
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
