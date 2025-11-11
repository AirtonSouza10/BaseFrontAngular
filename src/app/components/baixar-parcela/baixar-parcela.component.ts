import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DuplicataService, BaixaParcelaRequestDTO } from '../../services/duplicata.service';
import { TipoPagamentoService, TipoPagamentoDTO } from '../../services/tipo-pagamento.service';

@Component({
  selector: 'app-baixar-parcela',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './baixar-parcela.component.html',
  styleUrls: ['./baixar-parcela.component.css']
})
export class BaixarParcelaComponent implements OnInit, OnChanges {
  @Input() duplicataSelecionada: any;

  form!: FormGroup;
  mensagemSucesso: string | null = null;
  mensagemErro: string | null = null;
  tiposPagamento: TipoPagamentoDTO[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly duplicataService: DuplicataService,
    private readonly tipoPagamentoService: TipoPagamentoService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null, [Validators.required]],
      dtPagamento: [null, [Validators.required]],
      valorPago: [null, [Validators.required, Validators.min(0.01)]],
      observacao: [''],
      tipoPagamentoId: [null]
    });

    this.carregarTiposPagamento();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['duplicataSelecionada'] && this.duplicataSelecionada) {
      const id = this.duplicataSelecionada.id;
      if (this.form) {
        this.form.patchValue({ idParcela: id });
      }
      this.buscarParcelaporId(id);
    }
  }

  private buscarParcelaporId(id: number): void {
    this.duplicataService.buscarParcelaPorId(id).subscribe({
      next: (res) => {
        const parcela = res.resposta;
        if (parcela) {
          this.form.patchValue({
            id: id,
            valorPago: parcela.valor ?? 0,
            observacao: parcela.observacao ?? '',
            tipoPagamentoId: parcela.tipoPagamentoId ?? null
          });
        } else {
          this.mensagemErro = 'Nenhum dado encontrado para esta parcela.';
        }
      },
      error: (err) => {
        console.error('Erro ao buscar parcela:', err);
        this.mensagemErro = 'Erro ao carregar dados da parcela.';
      }
    });
  }

  private carregarTiposPagamento(): void {
    this.tipoPagamentoService.listarTiposPagamento().subscribe({
      next: (res) => (this.tiposPagamento = res.resposta || res),
      error: (err) => console.error('Erro ao carregar tipos de pagamento:', err)
    });
  }

  baixarParcela(): void {
    this.mensagemErro = null;
    this.mensagemSucesso = null;

    if (this.form.invalid) {
      this.mensagemErro = 'Preencha todos os campos obrigatórios.';
      return;
    }

    const id = this.form.get('id')?.value;

    if (!id) {
      this.mensagemErro = 'ID da parcela não encontrado.';
      return;
    }

    const dto: BaixaParcelaRequestDTO = {
      id: this.form.value.id,
      dtPagamento: this.form.value.dtPagamento,
      valorPago: this.form.value.valorPago,
      observacao: this.form.value.observacao,
      tipoPagamentoId: this.form.value.tipoPagamentoId
    };

    this.duplicataService.baixarParcela(id, dto).subscribe({
      next: () => {
        this.mensagemSucesso = 'Parcela baixada com sucesso!';
        this.form.reset();
      },
      error: (err) => {
        console.error(err);
        this.mensagemErro = 'Erro ao baixar a parcela. Tente novamente.';
      }
    });
  }
}
