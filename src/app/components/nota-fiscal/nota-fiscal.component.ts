import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotaFiscalService, NotaFiscalDTO, ParcelaPrevistaNotaDTO } from '../../services/nota-fiscal.service';
import { FornecedorService, FornecedorDTO } from '../../services/fornecedor.service';
import { TipoNotaService } from '../../services/tipo-nota.service';
import { FilialService, FilialDTO } from '../../services/filial.service';

@Component({
  selector: 'app-nota-fiscal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './nota-fiscal.component.html',
  styleUrls: ['./nota-fiscal.component.css']
})
export class NotaFiscalComponent implements OnInit {
  form: FormGroup;
  notasFiscais: NotaFiscalDTO[] = [];
  fornecedores: FornecedorDTO[] = [];
  tiposNota: any[] = [];
  filiais: FilialDTO[] = [];
  sucessoMsg: string | null = null;
  erroMsg: string | null = null;
  editando: boolean = false;
  notaIdEdit?: number;
  private toastTimeout: any;
  quantidadeParcelas: number | undefined;

  constructor(
    private readonly fb: FormBuilder,
    private readonly notaService: NotaFiscalService,
    private readonly fornecedorService: FornecedorService,
    private readonly tipoNotaService: TipoNotaService,
    private readonly filialService: FilialService
  ) {
    this.form = this.fb.group({
      id: [null],
      numero: ['', Validators.required],
      serie: [''],
      chave: [''],
      descricaoObs: [''],
      valorTotal: [0.00, Validators.required],
      valorDesconto: [0.00],
      valorIcms: [0.00],
      valorJuros: [0.00],
      valorMulta: [0.00],
      dtCompra: ['', Validators.required],
      fornecedorId: [null, Validators.required],
      tipoNotaId: [null, Validators.required],
      filialId: [null, Validators.required],
      pessoaId: [null],
      quantidadeParcelas: [1, [Validators.min(1)]],
      dtPrimeiraParcela: [''],
      intervaloDias: [30, [Validators.min(1)]],
      parcelasPrevistas: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.listarNotasFiscais();
    this.fornecedorService.listar().subscribe(res => this.fornecedores = res?.resposta || []);
    this.tipoNotaService.listarTiposNota().subscribe(res => this.tiposNota = res?.resposta || []);
    this.filialService.listarFiliais().subscribe(res => this.filiais = res?.resposta || []);

    // Atualiza automaticamente as parcelas se o valor total mudar
    this.form.get('valorTotal')?.valueChanges.subscribe(() => {
      const quantidade = this.form.get('quantidadeParcelas')?.value;
      const dtPrimeira = this.form.get('dtPrimeiraParcela')?.value;
      if (quantidade > 0 && dtPrimeira) this.gerarParcelas();
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

  editarNotaFiscal(nota: NotaFiscalDTO): void {
    if (!nota) return;

    this.editando = true;
    this.notaIdEdit = nota.id;

    // Preenche campos do formulário
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
      tipoNotaId: nota.tipoNotaId,
      filialId: nota.filialId,
      pessoaId: nota.pessoaId,
      dtPrimeiraParcela: nota.parcelasPrevistas?.[0]?.dtVencimentoPrevisto || '',
      intervaloDias: 30
    });

    // Atualiza a quantidade de parcelas
    this.quantidadeParcelas = nota.parcelasPrevistas?.length || 1;

    // Limpa e preenche o FormArray de parcelas
    this.parcelasPrevistas.clear();
    nota.parcelasPrevistas?.forEach(p => {
      this.parcelasPrevistas.push(this.fb.group({
        id: [p.id || null],
        dtVencimentoPrevisto: [p.dtVencimentoPrevisto],
        valorPrevisto: [p.valorPrevisto]
      }));
    });
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
    this.form.reset({ quantidadeParcelas: 1, intervaloDias: 30 });
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
}
