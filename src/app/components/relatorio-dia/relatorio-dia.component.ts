import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DuplicataService, DuplicataDiaResponseDTO } from '../../services/duplicata.service';
import { NgForOf } from '@angular/common';
import { DecimalPipe, DatePipe } from '@angular/common';
import { BaixarParcelaComponent } from "../baixar-parcela/baixar-parcela.component";

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

  constructor(private readonly duplicataService: DuplicataService) {}

  ngOnInit(): void {
    this.carregarDuplicatasDia();
    this.carregarDuplicatasVencidas();
  }

  carregarDuplicatasDia(): void {
    this.carregandoDia = true;
    this.duplicataService.obterContasPagarDia().subscribe({
      next: res => {
        // Corrigido para pegar o array dentro de "resposta"
        this.duplicatasDia = res?.resposta || [];
        this.carregandoDia = false;
      },
      error: err => {
        this.erroMsg = 'Erro ao carregar duplicatas do dia';
        this.carregandoDia = false;
      }
    });
  }

  carregarDuplicatasVencidas(): void {
    this.carregandoVencidas = true;
    this.duplicataService.obterContasPagarVencida().subscribe({
      next: res => {
        // Corrigido para pegar o array dentro de "resposta"
        this.duplicatasVencidas = res?.resposta || [];
        this.carregandoVencidas = false;
      },
      error: err => {
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
    this.carregarDuplicatasDia();
    this.carregarDuplicatasVencidas();
  }

    // ================= RELATORIO FORNECEDORES  =================
  abrirPDF() {
    this.duplicataService.gerarRelatorioDia().subscribe({
      next: (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: (err) => console.error('Erro ao gerar PDF', err)
    });
  }
}
