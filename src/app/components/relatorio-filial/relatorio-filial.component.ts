import { Component, OnInit } from '@angular/core';
import { DuplicataService } from '../../services/duplicata.service';
import { FilialService, FilialDTO } from '../../services/filial.service';
import { TipoDuplicataService } from '../../services/tipo-duplicata.service';
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
  tipos: any[] = [];

  filialSelecionada: number | null = null;
  tipoSelecionado: number | null = null;

  relatorio: any = null;
  carregando = false;

  constructor(
    private readonly duplicataService: DuplicataService,
    private readonly filialService: FilialService,
    private readonly tipoService: TipoDuplicataService
  ) {}

  ngOnInit(): void {
    this.carregarFiliais();
    this.carregarTipos();
  }

  carregarFiliais(): void {
    this.filialService.listarFiliais().subscribe({
      next: (data) => {
        this.filiais = data.resposta;
      },
      error: (err) => console.error('Erro ao carregar filiais:', err)
    });
  }

  carregarTipos(): void {
    this.tipoService.listarTipos().subscribe({
      next: (data) => {
        this.tipos = data.resposta || data;
      },
      error: (err) => console.error('Erro ao carregar tipos:', err)
    });
  }

  gerarRelatorio(): void {
    if (!this.filialSelecionada) return;
    this.carregando = true;

    this.duplicataService
      .obterRelatorioContasEmAbertoPorFilial(this.filialSelecionada, this.tipoSelecionado ?? undefined)
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

    this.duplicataService
      .gerarRelatorioContasEmAbertoPorFilialPDF(this.filialSelecionada, this.tipoSelecionado ?? undefined)
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
