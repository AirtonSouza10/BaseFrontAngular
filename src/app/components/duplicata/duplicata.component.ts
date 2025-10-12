import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DuplicataService, DuplicataDTO } from '../../services/duplicata.service';
import { FormsModule } from '@angular/forms';
import { FormaPagamentoDTO, FormaPagamentoService } from '../../services/forma-pagamento.service';
import { NgxCurrencyDirective } from 'ngx-currency';

@Component({
  selector: 'app-duplicata',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,NgxCurrencyDirective],
  templateUrl: './duplicata.component.html',
  styleUrls: ['./duplicata.component.css']
})
export class DuplicataComponent implements OnInit {
  form: FormGroup;
  duplicatas: DuplicataDTO[] = [];
  formasPagamento: FormaPagamentoDTO[] = [];
  sucessoMsg: string | null = null;
  erroMsg: string | null = null;
  editando: boolean = false;
  duplicataIdEdit?: number;
  private toastTimeout: any;

  currencyOptions = {
    prefix: 'R$ ',
    thousands: '.',
    decimal: ',',
    precision: 2
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly duplicataService: DuplicataService,
    private readonly formaPagamentoService: FormaPagamentoService
  ) {
    this.form = this.fb.group({
      id: [null],
      descricao: ['', Validators.required],
      valor: [0.00, Validators.required],
      desconto: [0.00],
      multa: [0.00],
      juros: [0.00],
      valorTotal: [0.00, Validators.required],
      dtCriacao: [''],
      dtAtualizacao: [''],
      quantidadeParcelas: [1, [Validators.min(1)]],
      dtPrimeiraParcela: [''],
      formaPagamentoId: [null],
      intervaloDias: [30, [Validators.min(1)]],
      parcelas: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.listarDuplicatas();
    this.formaPagamentoService.listar().subscribe(res => this.formasPagamento = res?.resposta || []);

    // Atualiza valor total da duplicata automaticamente
    ['valor', 'desconto', 'multa', 'juros'].forEach(field => {
      this.form.get(field)!.valueChanges.subscribe(() => {
        this.atualizarValorTotalDuplicata();
        this.gerarParcelas();
      });
    });

    // Atualiza parcelas se data da primeira parcela mudar
    this.form.get('dtPrimeiraParcela')!.valueChanges.subscribe(() => this.gerarParcelas());

    // Atualiza quantidade de parcelas e intervalo ao mudar forma de pagamento
    this.form.get('formaPagamentoId')!.valueChanges.subscribe((formaId: number | null) => {
      if (formaId != null) {
        this.onFormaPagamentoChange(formaId);
      }
    });
  }

  get parcelas(): FormArray {
    return this.form.get('parcelas') as FormArray;
  }

  private atualizarValorTotalDuplicata(): void {
    const valor = parseFloat(this.form.get('valor')!.value) || 0;
    const desconto = parseFloat(this.form.get('desconto')!.value) || 0;
    const multa = parseFloat(this.form.get('multa')!.value) || 0;
    const juros = parseFloat(this.form.get('juros')!.value) || 0;
    const valorTotal = valor + multa + juros - desconto;
    this.form.get('valorTotal')!.setValue(valorTotal.toFixed(2), { emitEvent: false });
  }

  onFormaPagamentoChange(formaId: number) {
    const forma = this.formasPagamento.find(f => f.id === formaId);
    if (!forma) return;

    // Atualiza quantidade de parcelas e intervalo
    this.form.get('quantidadeParcelas')!.setValue(forma.qtdeParcelas || 1);
    this.form.get('intervaloDias')!.setValue(forma.intervaloParcelas || 30);

    // Calcula data da primeira parcela baseado no prazo da forma de pagamento
    const hoje = new Date();
    const prazo = forma.prazoPrimeiraParcela || 0;
    const primeiraParcela = new Date(hoje);
    primeiraParcela.setDate(primeiraParcela.getDate() + prazo);
    this.form.get('dtPrimeiraParcela')!.setValue(primeiraParcela.toISOString().substring(0, 10), { emitEvent: false });

    // Gera as parcelas
    this.gerarParcelas();
  }

  gerarParcelas(): void {
    const valorTotal = parseFloat(this.form.get('valorTotal')!.value) || 0;
    const quantidadeParcelas = this.form.get('quantidadeParcelas')!.value || 1;
    const primeiraParcelaStr = this.form.get('dtPrimeiraParcela')!.value;
    const intervaloDias = this.form.get('intervaloDias')!.value || 30;

    if (!valorTotal || !quantidadeParcelas || !primeiraParcelaStr) return;

    this.parcelas.clear();
    const valorParcela = parseFloat((valorTotal / quantidadeParcelas).toFixed(2));
    const dataBase = new Date(primeiraParcelaStr);

    for (let i = 0; i < quantidadeParcelas; i++) {
      let valor = valorParcela;
      if (i === quantidadeParcelas - 1) {
        const somaAtual = valorParcela * (quantidadeParcelas - 1);
        valor = parseFloat((valorTotal - somaAtual).toFixed(2));
      }

      const vencimento = new Date(dataBase);
      vencimento.setDate(vencimento.getDate() + i * intervaloDias);

      this.parcelas.push(this.fb.group({
        id: [null],
        dtVencimento: [vencimento.toISOString().substring(0, 10)],
        valorTotal: [{ value: valor, disabled: true }]
      }));
    }
  }

  onSubmit(): void {
    if (!this.form.valid) return;
    const dto: DuplicataDTO = { ...this.form.getRawValue() };

    if (this.editando && this.duplicataIdEdit) {
      this.duplicataService.atualizar(this.duplicataIdEdit, dto).subscribe({
        next: () => {
          this.showSuccess('Duplicata atualizada com sucesso!');
          this.cancelarEdicao();
          this.listarDuplicatas();
        },
        error: () => this.showError('Erro ao atualizar duplicata')
      });
    } else {
      this.duplicataService.salvar(dto).subscribe({
        next: () => {
          this.showSuccess('Duplicata salva com sucesso!');
          this.cancelarEdicao();
          this.listarDuplicatas();
        },
        error: () => this.showError('Erro ao salvar duplicata')
      });
    }
  }

  listarDuplicatas(): void {
    this.duplicataService.listar().subscribe(res => this.duplicatas = res.resposta || []);
  }

  editarDuplicata(d: DuplicataDTO): void {
    this.editando = true;
    this.duplicataIdEdit = d.id;

    this.form.patchValue({
      id: d.id,
      descricao: d.descricao,
      valor: d.valor,
      desconto: d.desconto,
      multa: d.multa,
      juros: d.juros ?? 0,
      valorTotal: d.valorTotal,
      dtPrimeiraParcela: d.parcelas?.[0]?.dtVencimento || '',
      formaPagamentoId: d.formaPagamentoId,
    });

    const forma = this.formasPagamento.find(f => f.id === d.formaPagamentoId);
    this.form.get('quantidadeParcelas')!.setValue(forma?.qtdeParcelas || d.parcelas?.length || 1);
    this.form.get('intervaloDias')!.setValue(forma?.intervaloParcelas || 30);

    this.parcelas.clear();
    d.parcelas?.forEach(p => {
      this.parcelas.push(this.fb.group({
        id: [p.id],
        dtVencimento: [p.dtVencimento],
        valorTotal: [{ value: p.valorTotal, disabled: true }]
      }));
    });
  }

  excluirDuplicata(id?: number): void {
    if (!id) return;
    if (!confirm('Tem certeza que deseja excluir esta duplicata?')) return;

    this.duplicataService.excluir(id).subscribe({
      next: () => {
        this.showSuccess('Duplicata excluída com sucesso!');
        this.listarDuplicatas();
      },
      error: () => this.showError('Erro ao excluir duplicata')
    });
  }

  cancelarEdicao(): void {
    this.editando = false;
    this.duplicataIdEdit = undefined;
    this.form.reset({ quantidadeParcelas: 1, intervaloDias: 30 });
    this.parcelas.clear();
  }

  private showSuccess(msg: string) {
    this.sucessoMsg = msg;
    this.erroMsg = null;
    this.clearToast();
    this.toastTimeout = setTimeout(() => (this.sucessoMsg = null), 4000);
  }

  private showError(msg: string) {
    this.erroMsg = msg;
    this.sucessoMsg = null;
    this.clearToast();
    this.toastTimeout = setTimeout(() => (this.erroMsg = null), 4000);
  }

  private clearToast() {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
  }
}
