import { Component, OnInit } from '@angular/core';
import { DuplicataService } from '../../services/duplicata.service';
import { FilialService, FilialDTO } from '../../services/filial.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-relatorio-filial',
    imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    ],
  templateUrl: './relatorio-filial.component.html',
  styleUrls: ['./relatorio-filial.component.css']
})
export class RelatorioFilialComponent implements OnInit {
  filiais: FilialDTO[] = [];
  filialSelecionada: number | null = null;
  relatorio: any = null;
  carregando = false;

  constructor(
    private readonly duplicataService: DuplicataService,
    private readonly filialService: FilialService
  ) {}

  ngOnInit(): void {
    this.carregarFiliais();
  }

  carregarFiliais(): void {
    this.filialService.listarFiliais().subscribe({
      next: (data) => {
        this.filiais = data.resposta;
      },
      error: (err) => console.error('Erro ao carregar filiais:', err)
    });
  }

  gerarRelatorio(): void {
    if (!this.filialSelecionada) return;
    this.carregando = true;

    this.duplicataService.obterRelatorioContasEmAbertoPorFilial(this.filialSelecionada)
      .subscribe({
        next: (res) => {
          this.relatorio = res.resposta || res;
          this.carregando = false;
        },
        error: (err) => {
          console.error('Erro ao gerar relatório:', err);
          this.carregando = false;
        }
      });
  }

  gerarRelatorioPDF(): void {
    if (!this.filialSelecionada) return;

    this.duplicataService.gerarRelatorioContasEmAbertoPorFilialPDF(this.filialSelecionada)
      .subscribe({
        next: (pdf) => {
          const blob = new Blob([pdf], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
        },
        error: (err) => console.error('Erro ao gerar PDF:', err)
      });
  }
}
