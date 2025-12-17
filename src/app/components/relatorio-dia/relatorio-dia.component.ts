import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { DuplicataService, DuplicataDiaResponseDTO } from '../../services/duplicata.service';
import { NgForOf } from '@angular/common';
import { BaixarParcelaComponent } from "../baixar-parcela/baixar-parcela.component";
import { NotaFiscalService } from '../../services/nota-fiscal.service';

@Component({
  selector: 'app-relatorio-dia',
  standalone: true,
  imports: [CommonModule, NgForOf, DecimalPipe, DatePipe, BaixarParcelaComponent],
  templateUrl: './relatorio-dia.component.html',
  styleUrls: ['./relatorio-dia.component.css']
})
export class RelatorioDiaComponent implements OnInit {

  duplicatasDia: DuplicataDiaResponseDTO[] = [];
  duplicatasVencidas: DuplicataDiaResponseDTO[] = [];

  carregandoDia = true;
  carregandoVencidas = true;
  erroMsg: string | null = null;

  duplicataSelecionada: any = null;

constructor(
  private readonly duplicataService: DuplicataService,
  private readonly notaFiscalService: NotaFiscalService
) {}

  ngOnInit(): void {
    this.carregarDuplicatasDia();
    this.carregarDuplicatasVencidas();
  }

  carregarDuplicatasDia(): void {
    this.carregandoDia = true;
    this.duplicataService.obterContasPagarDia().subscribe({
      next: res => {
        this.duplicatasDia = res?.resposta || [];
        this.carregandoDia = false;
      },
      error: () => {
        this.erroMsg = 'Erro ao carregar duplicatas do dia';
        this.carregandoDia = false;
      }
    });
  }

  carregarDuplicatasVencidas(): void {
    this.carregandoVencidas = true;
    this.duplicataService.obterContasPagarVencida().subscribe({
      next: res => {
        this.duplicatasVencidas = res?.resposta || [];
        this.carregandoVencidas = false;
      },
      error: () => {
        this.erroMsg = 'Erro ao carregar duplicatas vencidas';
        this.carregandoVencidas = false;
      }
    });
  }

  abrirBaixa(duplicata: any): void {
    this.duplicataSelecionada = duplicata;
  }

  fecharBaixa(): void {
    this.duplicataSelecionada = null;
    this.recarregarRelatorio();
  }

  abrirPDF(): void {
    this.duplicataService.gerarRelatorioDia().subscribe({
      next: (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: err => console.error('Erro ao gerar PDF', err)
    });
  }

  // ===== NOVAS FUNCIONALIDADES =====

  confirmarExclusaoParcela(d: any): void {
    if (!confirm('Deseja realmente excluir esta parcela prevista?')) {
      return;
    }

    this.notaFiscalService.excluirParcelaPrevista(d.id).subscribe({
      next: () => this.recarregarRelatorio(),
      error: () => alert('Erro ao excluir parcela prevista')
    });
  }

  confirmarConversaoParcela(d: any): void {
    if (!confirm('Deseja realmente converter esta parcela prevista em duplicata?')) {
      return;
    }

    this.notaFiscalService
      .converterParcelasPrevistasEmDuplicata(d.id)
      .subscribe({
        next: () => {
          alert('Parcela convertida em duplicata com sucesso!');
          this.recarregarRelatorio();
        },
        error: () => alert('Erro ao converter parcela')
      });
  }


  private recarregarRelatorio(): void {
    this.carregarDuplicatasDia();
    this.carregarDuplicatasVencidas();
  }
}
