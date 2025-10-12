import { FormaPagamentoService, FormaPagamentoDTO } from './../../services/forma-pagamento.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotaFiscalService, NotaFiscalDTO } from '../../services/nota-fiscal.service';
import { FornecedorService, FornecedorDTO } from '../../services/fornecedor.service';
import { TipoNotaService } from '../../services/tipo-nota.service';
import { FilialService, FilialDTO } from '../../services/filial.service';
import { NgxCurrencyDirective } from 'ngx-currency';

@Component({
  selector: 'app-nota-fiscal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,NgxCurrencyDirective],
  templateUrl: './nota-fiscal.component.html',
  styleUrls: ['./nota-fiscal.component.css']
})
export class NotaFiscalComponent implements OnInit {
  form: FormGroup;
  notasFiscais: NotaFiscalDTO[] = [];
  fornecedores: FornecedorDTO[] = [];
  fornecedoresFiltrados: FornecedorDTO[] = [];
  formasPagamento: FormaPagamentoDTO[] = [];
  tiposNota: any[] = [];
  filiais: FilialDTO[] = [];
  sucessoMsg: string | null = null;
  erroMsg: string | null = null;
  editando: boolean = false;
  notaIdEdit?: number;
  private toastTimeout: any;

  currencyOptions = {
    prefix: 'R$ ',
    thousands: '.',
    decimal: ',',
    precision: 2
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly notaService: NotaFiscalService,
    private readonly fornecedorService: FornecedorService,
    private readonly tipoNotaService: TipoNotaService,
    private readonly filialService: FilialService,
    private readonly formaPagamentoService: FormaPagamentoService,
  ) {
    this.form = this.fb.group({
      id: [null],
      numero: ['', Validators.required],
      serie: [''],
      chave: [''],
      descricaoObs: [''],
      valorTotal: [0, Validators.required],
      valorDesconto: [0],
      valorIcms: [0],
      valorJuros: [0],
      valorMulta: [0],
      dtCompra: ['', Validators.required],
      fornecedorId: [null, Validators.required],
      fornecedorInput: ['', Validators.required], // novo input
      tipoNotaId: [null, Validators.required],
      formaPagamentoId: [null],
      filialId: [null, Validators.required],
      pessoaId: [null],
      quantidadeParcelas: [{ value: 1, disabled: true }],
      dtPrimeiraParcela: [''],
      intervaloDias: [{ value: 30, disabled: true }],
      parcelasPrevistas: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.listarNotasFiscais();
    this.fornecedorService.listar().subscribe(res => this.fornecedores = res?.resposta || []);
    this.tipoNotaService.listarTiposNota().subscribe(res => this.tiposNota = res?.resposta || []);
    this.filialService.listarFiliais().subscribe(res => this.filiais = res?.resposta || []);
    this.formaPagamentoService.listar().subscribe(res => this.formasPagamento = res?.resposta || []);

    this.configurarReacoesForm();
  }

  private configurarReacoesForm(): void {
    this.form.get('formaPagamentoId')?.valueChanges.subscribe(formaId => {
      this.atualizarCamposFormaPagamento(formaId);
    });

    this.form.get('dtCompra')?.valueChanges.subscribe(() => {
      const formaId = this.form.get('formaPagamentoId')?.value;
      if (formaId) this.atualizarCamposFormaPagamento(formaId);
    });

    this.form.get('valorTotal')?.valueChanges.subscribe(() => {
      if (this.form.get('quantidadeParcelas')?.value && this.form.get('dtPrimeiraParcela')?.value) {
        this.gerarParcelas();
      }
    });
  }

  private atualizarCamposFormaPagamento(formaId: number | null): void {
    if (!formaId) return;

    this.formaPagamentoService.buscarPorId(formaId).subscribe(fp => {
      const dados = fp.resposta;
      if (!dados) return;

      const dtCompraStr = this.form.get('dtCompra')?.value;
      const dtCompra = dtCompraStr ? new Date(dtCompraStr) : new Date();

      const dtPrimeira = new Date(dtCompra);
      dtPrimeira.setDate(dtPrimeira.getDate() + (dados.prazoPrimeiraParcela || 0));

      this.form.patchValue({
        quantidadeParcelas: dados.qtdeParcelas || 1,
        dtPrimeiraParcela: dtPrimeira.toISOString().substring(0, 10),
        intervaloDias: dados.intervaloParcelas || 30
      });

      this.gerarParcelas();
    });
  }

  get parcelasPrevistas(): FormArray {
    return this.form.get('parcelasPrevistas') as FormArray;
  }

  gerarParcelas(): void {
    const valorTotal = this.form.get('valorTotal')?.value || 0;
    const quantidadeParcelas = this.form.get('quantidadeParcelas')?.value || 1;
    const primeiraParcelaStr = this.form.get('dtPrimeiraParcela')?.value;
    const intervaloDias = this.form.get('intervaloDias')?.value || 30;

    if (!valorTotal || !quantidadeParcelas || !primeiraParcelaStr) return;

    this.parcelasPrevistas.clear();

    const valorParcela = parseFloat((valorTotal / quantidadeParcelas).toFixed(2));
    const dataBase = new Date(primeiraParcelaStr);

    for (let i = 0; i < quantidadeParcelas; i++) {
      const vencimento = new Date(dataBase);
      vencimento.setDate(vencimento.getDate() + i * intervaloDias);

      this.parcelasPrevistas.push(this.fb.group({
        id: [null],
        dtVencimentoPrevisto: [vencimento.toISOString().substring(0, 10)],
        valorPrevisto: [valorParcela]
      }));
    }
  }

  editarNotaFiscal(nota: NotaFiscalDTO): void {
    if (!nota) return;

    this.editando = true;
    this.notaIdEdit = nota.id;

    this.form.patchValue({
      id: nota.id,
      numero: nota.numero,
      serie: nota.serie,
      chave: nota.chave,
      descricaoObs: nota.descricaoObs,
      valorTotal: nota.valorTotal,
      valorDesconto: nota.valorDesconto,
      valorIcms: nota.valorIcms,
      valorJuros: nota.valorJuros,
      valorMulta: nota.valorMulta,
      dtCompra: nota.dtCompra,
      fornecedorId: nota.fornecedorId,
      fornecedorInput: this.getFornecedorNome(nota.fornecedorId),
      tipoNotaId: nota.tipoNotaId,
      filialId: nota.filialId,
      pessoaId: nota.pessoaId,
      formaPagamentoId: nota.formaPagamentoId,
      quantidadeParcelas: nota.parcelasPrevistas?.length || 1,
      dtPrimeiraParcela: nota.parcelasPrevistas?.[0]?.dtVencimentoPrevisto || '',
      intervaloDias: 30
    });

    this.parcelasPrevistas.clear();
    nota.parcelasPrevistas?.forEach(p => {
      this.parcelasPrevistas.push(this.fb.group({
        id: [p.id || null],
        dtVencimentoPrevisto: [p.dtVencimentoPrevisto],
        valorPrevisto: [p.valorPrevisto]
      }));
    });

    if (nota.formaPagamentoId) {
      this.formaPagamentoService.buscarPorId(nota.formaPagamentoId).subscribe(fp => {
        const dtCompra = new Date(nota.dtCompra);
        const dtPrimeira = new Date(dtCompra);
        dtPrimeira.setDate(dtPrimeira.getDate() + (fp.prazoPrimeiraParcela || 0));

        if (!this.form.get('intervaloDias')?.value) {
          this.form.patchValue({ intervaloDias: fp.intervaloParcelas || 30 });
        }

        this.gerarParcelas();
      });
    }
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    const notaDTO = this.form.value;
    if (this.parcelasPrevistas.length === 0) notaDTO.parcelasPrevistas = null;

    if (this.editando && this.notaIdEdit) {
      this.notaService.atualizar(this.notaIdEdit, notaDTO).subscribe({
        next: () => {
          this.showSuccess('Nota fiscal atualizada com sucesso!');
          this.cancelarEdicao();
          this.listarNotasFiscais();
        },
        error: err => this.showError(err?.error?.msgErro?.[0] || 'Erro ao atualizar nota fiscal')
      });
    } else {
      this.notaService.salvar(notaDTO).subscribe({
        next: () => {
          this.showSuccess('Nota fiscal salva com sucesso!');
          this.cancelarEdicao();
          this.listarNotasFiscais();
        },
        error: err => this.showError(err?.error?.msgErro?.[0] || 'Erro ao salvar nota fiscal')
      });
    }
  }

  listarNotasFiscais(): void {
    this.notaService.listar().subscribe(res => this.notasFiscais = res?.resposta || []);
  }

  excluirNotaFiscal(id?: number): void {
    if (!id) return;

    this.notaService.excluir(id).subscribe({
      next: () => {
        this.showSuccess('Nota fiscal excluída com sucesso!');
        this.listarNotasFiscais();
      },
      error: err => this.showError(err?.error?.msgErro?.[0] || 'Erro ao excluir nota fiscal')
    });
  }

  cancelarEdicao(): void {
    this.editando = false;
    this.notaIdEdit = undefined;

    // 🔹 Recria completamente o formulário (limpa reações e valores anteriores)
    this.form = this.fb.group({
      id: [null],
      numero: ['', Validators.required],
      serie: [''],
      chave: [''],
      descricaoObs: [''],
      valorTotal: [0, Validators.required],
      valorDesconto: [0],
      valorIcms: [0],
      valorJuros: [0],
      valorMulta: [0],
      dtCompra: ['', Validators.required],
      fornecedorId: [null, Validators.required],
      fornecedorInput: ['', Validators.required],
      tipoNotaId: [null, Validators.required],
      formaPagamentoId: [null],
      filialId: [null, Validators.required],
      pessoaId: [null],
      quantidadeParcelas: [{ value: 1, disabled: true }],
      dtPrimeiraParcela: [''],
      intervaloDias: [{ value: 30, disabled: true }],
      parcelasPrevistas: this.fb.array([])
    });

    // 🔹 Reconfigura as reações (pois recriou o form)
    this.configurarReacoesForm();

    // 🔹 Limpa a lista de parcelas na memória
    this.parcelasPrevistas.clear();
  }

  private showSuccess(message: string) {
    this.sucessoMsg = message;
    this.erroMsg = null;
    this.clearToast();
    this.toastTimeout = setTimeout(() => (this.sucessoMsg = null), 4000);
  }

  private showError(message: string) {
    this.erroMsg = message;
    this.sucessoMsg = null;
    this.clearToast();
    this.toastTimeout = setTimeout(() => (this.erroMsg = null), 4000);
  }

  private clearToast() {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
  }

  getFornecedorNome(id?: number): string {
    return this.fornecedores.find(f => f.id === id)?.nome || '';
  }

  getFilialNome(id?: number): string {
    return this.filiais.find(f => f.id === id)?.nome || '';
  }

  /** AUTOCOMPLETE FORNECEDOR */
  filtrarFornecedores(): void {
    const val = this.form.get('fornecedorInput')?.value?.toLowerCase() || '';
    this.fornecedoresFiltrados = this.fornecedores.filter(f =>
      f.nome.toLowerCase().includes(val) || f.identificacao?.toLowerCase().includes(val)
    );
  }

  abrirAutocomplete(): void {
    this.fornecedoresFiltrados = this.fornecedores;
  }

  selecionarFornecedor(f: FornecedorDTO): void {
    this.form.patchValue({ fornecedorId: f.id, fornecedorInput: f.nome });
    this.fornecedoresFiltrados = [];
  }

  validarFornecedor(): void {
    const inputVal = this.form.get('fornecedorInput')?.value;
    const existe = this.fornecedores.some(f => f.nome === inputVal);
    if (!existe) {
      this.form.patchValue({ fornecedorId: null, fornecedorInput: '' });
    }
    this.fornecedoresFiltrados = [];
  }
}
