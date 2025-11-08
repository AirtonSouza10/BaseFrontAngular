import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCurrencyDirective } from 'ngx-currency';
import { NotaFiscalService, NotaFiscalDTO, ParcelaPrevistaNotaDTO } from '../../services/nota-fiscal.service';
import { FornecedorService, FornecedorDTO } from '../../services/fornecedor.service';
import { TipoNotaService } from '../../services/tipo-nota.service';
import { FilialService, FilialDTO } from '../../services/filial.service';
import { FormaPagamentoService, FormaPagamentoDTO } from '../../services/forma-pagamento.service';
import { DuplicataDTO, DuplicataService } from '../../services/duplicata.service';

@Component({
  selector: 'app-nota-fiscal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxCurrencyDirective],
  templateUrl: './nota-fiscal.component.html',
  styleUrls: ['./nota-fiscal.component.css']
})
export class NotaFiscalComponent implements OnInit {
  @Output() notaCriada = new EventEmitter<NotaFiscalDTO>();
  @Input() isModal: boolean = false;

  form: FormGroup;
  notasFiscais: NotaFiscalDTO[] = [];
  fornecedores: FornecedorDTO[] = [];
  fornecedoresFiltrados: FornecedorDTO[] = [];
  formasPagamento: FormaPagamentoDTO[] = [];
  tiposNota: any[] = [];
  filiais: FilialDTO[] = [];
  duplicatasFiltradas: DuplicataDTO[] = [];
  duplicatas: DuplicataDTO[] = [];

  sucessoMsg: string | null = null;
  erroMsg: string | null = null;
  editando: boolean = false;
  notaIdEdit?: number;
  private toastTimeout: any;

  // Paginação
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  totalElements = 0;

  // Filtros
  filtroNumero: string = '';
  filtroFornecedorId?: number;
  filtroFornecedor?: number;

  //modal duplicatas
  modalDuplicataAberto: boolean = false;
  filtroModalDuplicata: string = '';
  duplicatasFiltradasModal: DuplicataDTO[] = [];

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
    private readonly duplicataService: DuplicataService,

  ) {
    this.form = this.criarForm();
  }

  ngOnInit(): void {
    this.listarNotasFiscais();
    this.fornecedorService.listar().subscribe(res => this.fornecedores = res?.resposta || []);
    this.tipoNotaService.listarTiposNota().subscribe(res => this.tiposNota = res?.resposta || []);
    this.filialService.listarFiliais().subscribe(res => this.filiais = res?.resposta || []);
    this.formaPagamentoService.listar().subscribe(res => this.formasPagamento = res?.resposta || []);
    this.configurarReacoesForm();
  }

  private criarForm(): FormGroup {
    return this.fb.group({
      id: [null],
      numero: ['', Validators.required],
      serie: [''],
      chave: [''],
      descricaoObs: [''],
      duplicataInput: [''],
      duplicataId: [null],
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
      parcelasPrevistas: this.fb.array([]),
      gerarParcelasPrevistas: [false]
    });
  }

  private configurarReacoesForm(): void {
    this.form.get('formaPagamentoId')?.valueChanges.subscribe(formaId => this.atualizarCamposFormaPagamento(formaId));
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
        valorPrevisto: [valorParcela],
        numeroParcela: [`${i + 1}/${quantidadeParcelas}`]
      }));
    }
  }

  editarNotaFiscal(nota: NotaFiscalDTO): void {
    if (!nota) return;
    this.editando = true;
    this.notaIdEdit = nota.id;

    this.form = this.criarForm();
    this.form.patchValue({
      ...nota,
      fornecedorInput: this.getFornecedorNome(nota.fornecedorId),
      duplicataInput: nota.dsDuplicata || '',
      quantidadeParcelas: nota.parcelasPrevistas?.length || 1,
      dtPrimeiraParcela: nota.parcelasPrevistas?.[0]?.dtVencimentoPrevisto || '',
      intervaloDias: 30,
      gerarParcelasPrevistas: !!nota.parcelasPrevistas?.length
    });

    this.parcelasPrevistas.clear();
    nota.parcelasPrevistas?.forEach(p => {
      this.parcelasPrevistas.push(this.fb.group({
        id: [p.id || null],
        dtVencimentoPrevisto: [p.dtVencimentoPrevisto],
        valorPrevisto: [p.valorPrevisto]
      }));
    });

    this.configurarReacoesForm();
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    const notaDTO = this.form.value;
    if (!this.form.get('gerarParcelasPrevistas')?.value) {
      notaDTO.formaPagamentoId = null;
      notaDTO.parcelasPrevistas = [];
    }

    const action$ = this.editando && this.notaIdEdit
      ? this.notaService.atualizar(this.notaIdEdit, notaDTO)
      : this.notaService.salvar(notaDTO);

    action$.subscribe({
      next: () => {
        this.showSuccess(this.editando ? 'Nota fiscal atualizada com sucesso!' : 'Nota fiscal salva com sucesso!');
        this.cancelarEdicao();
        this.listarNotasFiscais();
      },
      error: err => this.showError(err?.error?.msgErro?.[0] || 'Erro ao salvar/atualizar nota fiscal')
    });
  }

  /**
   * Lista notas fiscais dependendo se existem filtros
   */
  listarNotasFiscais(): void {
    if (this.filtroNumero || this.filtroFornecedorId) {
      // Busca filtrada por número e/ou fornecedor
      this.notaService
        .listarPaginadasByFornecedorAndNumero(this.currentPage, this.pageSize, this.filtroNumero, this.filtroFornecedorId)
        .subscribe(res => this.atualizarTabela(res));
    } else {
      // Busca todas as notas
      this.notaService
        .listarPaginadas(this.currentPage, this.pageSize)
        .subscribe(res => this.atualizarTabela(res));
    }
  }

  private atualizarTabela(res: any): void {
    this.notasFiscais = res?.resposta?.content || [];
    this.totalPages = res?.resposta?.totalPages || 0;
    this.totalElements = res?.resposta?.totalElements || 0;
  }

  aplicarFiltro(): void {
    this.filtroFornecedorId = this.filtroFornecedor || undefined;
    this.currentPage = 0;
    this.listarNotasFiscais();
  }

  mudarPagina(pagina: number): void {
    if (pagina < 0 || pagina >= this.totalPages) return;
    this.currentPage = pagina;
    this.listarNotasFiscais();
  }

  getPaginasVisiveis(): number[] {
    const paginas: number[] = [];
    const inicio = Math.max(0, this.currentPage - 2);
    const fim = Math.min(this.totalPages - 1, this.currentPage + 2);

    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }
    return paginas;
  }

  excluirNotaFiscal(id?: number): void {
    if (!id) return;
    if (!confirm('Tem certeza que deseja excluir esta nota fiscal?')) return;
    this.notaService.excluir(id).subscribe({
      next: () => { this.showSuccess('Nota fiscal excluída com sucesso!'); this.listarNotasFiscais(); },
      error: err => this.showError(err?.error?.msgErro?.[0] || 'Erro ao excluir nota fiscal')
    });
  }

  cancelarEdicao(): void {
    this.editando = false;
    this.notaIdEdit = undefined;
    this.form = this.criarForm();
    this.configurarReacoesForm();
    this.parcelasPrevistas.clear();
  }

  private showSuccess(message: string) { this.sucessoMsg = message; this.erroMsg = null; this.clearToast(); this.toastTimeout = setTimeout(() => this.sucessoMsg = null, 4000); }
  private showError(message: string) { this.erroMsg = message; this.sucessoMsg = null; this.clearToast(); this.toastTimeout = setTimeout(() => this.erroMsg = null, 4000); }
  private clearToast() { if (this.toastTimeout) clearTimeout(this.toastTimeout); }

  getFornecedorNome(id?: number): string { return this.fornecedores.find(f => f.id === id)?.nome || ''; }
  getFilialNome(id?: number): string { return this.filiais.find(f => f.id === id)?.nome || ''; }

  // Autocomplete fornecedor
  filtrarFornecedores(): void {
    const val = this.form.get('fornecedorInput')?.value?.toLowerCase() || '';
    this.fornecedoresFiltrados = this.fornecedores.filter(f =>
      f.nome.toLowerCase().includes(val) || f.identificacao?.toLowerCase().includes(val)
    );
  }

  limparFiltro(): void {
    this.filtroNumero = '';
    this.filtroFornecedor = undefined;
    this.filtroFornecedorId = undefined;
    this.currentPage = 0;
    this.listarNotasFiscais();
  }

  abrirAutocomplete(): void { this.fornecedoresFiltrados = this.fornecedores; }
  selecionarFornecedor(f: FornecedorDTO): void { this.form.patchValue({ fornecedorId: f.id, fornecedorInput: f.nome }); this.fornecedoresFiltrados = []; }
  validarFornecedor(): void {
    const inputVal = this.form.get('fornecedorInput')?.value;
    const existe = this.fornecedores.some(f => f.nome === inputVal);
    if (!existe) this.form.patchValue({ fornecedorId: null, fornecedorInput: '' });
    this.fornecedoresFiltrados = [];
  }

// ===================== Auto complete duplicata (agora modal) =====================
// Abrir modal de duplicata
abrirModalDuplicata(): void {
  this.modalDuplicataAberto = true;
  this.filtroModalDuplicata = '';
  this.duplicatasFiltradasModal = []; // começa vazio
}

// Fechar modal
fecharModalDuplicata(): void {
  this.modalDuplicataAberto = false;
  this.filtroModalDuplicata = '';
  this.duplicatasFiltradasModal = [];
}

// Pesquisar duplicatas no backend
pesquisarDuplicatas(): void {
  const val = this.filtroModalDuplicata?.trim();
  if (!val) {
    this.duplicatasFiltradasModal = [];
    return;
  }

  this.duplicataService.buscarPorDescricao(val).subscribe(res => {
    this.duplicatasFiltradasModal = res?.resposta || [];
  });
}

// Selecionar duplicata do modal
selecionarDuplicataModal(d: DuplicataDTO): void {
  this.form.patchValue({ duplicataId: d.id, duplicataInput: d.descricao });
  this.fecharModalDuplicata();
}

}
