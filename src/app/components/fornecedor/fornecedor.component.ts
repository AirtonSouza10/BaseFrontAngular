import { TipoService } from './../../services/tipo.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FornecedorService, FornecedorDTO, TelefoneDTO, EnderecoDTO } from '../../services/fornecedor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EnderecoService } from '../../services/endereco.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-fornecedor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.css']
})
export class FornecedorComponent implements OnInit {
  form: FormGroup;
  fornecedores: FornecedorDTO[] = [];
  tiposTelefone: any[] = [];
  tiposEndereco: any[] = [];
  sucessoMsg: string | null = null;
  erroMsg: string | null = null;
  editando: boolean = false;
  fornecedorIdEdit?: number;
  private toastTimeout: any;

  constructor(
    private readonly fb: FormBuilder,
    private readonly fornecedorService: FornecedorService,
    private readonly enderecoService: EnderecoService,
    private readonly snackBar: MatSnackBar,
    private readonly tipoService: TipoService,
  ) {
    this.form = this.fb.group({
      id: [null], // <-- id do fornecedor
      nome: ['', Validators.required],
      identificacao: ['', Validators.required],
      email: [''],
      ativo: [true],
      telefones: this.fb.array([]),
      enderecos: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.listarFornecedores();
    this.tipoService.listarTiposTelefone().subscribe(res => this.tiposTelefone = res.resposta || []);
    this.tipoService.listarTiposEndereco().subscribe(res => this.tiposEndereco = res.resposta || []);

    if (this.telefones.length === 0) this.addTelefone();
    if (this.enderecos.length === 0) this.addEndereco();
  }

  // ================= GETTERS =================
  get telefones(): FormArray { return this.form.get('telefones') as FormArray; }
  get enderecos(): FormArray { return this.form.get('enderecos') as FormArray; }

  // ================= ADD / REMOVE =================
  addTelefone(): void {
    this.telefones.push(this.fb.group({
      id: [null], // <-- id do telefone
      numero: ['', Validators.required],
      tpTelefone: [null, Validators.required]
    }));
  }

  removeTelefone(index: number): void {
    this.telefones.removeAt(index);
  }

  addEndereco(): void {
    this.enderecos.push(this.fb.group({
      id: [null], // <-- id do endereço
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      uf: ['', Validators.required],
      cep: ['', Validators.required],
      tipoEndereco: [null, Validators.required]
    }));
  }

  removeEndereco(index: number): void {
    this.enderecos.removeAt(index);
  }

  // ================= SUBMIT =================
  onSubmit(): void {
    if (!this.form.valid) return;

    const fornecedorDTO = this.form.value;

    if (this.editando && this.fornecedorIdEdit) {
      // Atualizar fornecedor existente
      this.fornecedorService.atualizar(this.fornecedorIdEdit, fornecedorDTO).subscribe({
        next: () => {
          this.showSuccess('Fornecedor atualizado com sucesso!');
          this.cancelarEdicao();
          this.listarFornecedores();
        },
        error: err => this.showError(err?.error?.msgErro?.[0] || 'Erro ao atualizar fornecedor')
      });
    } else {
      // Salvar novo fornecedor
      this.fornecedorService.salvar(fornecedorDTO).subscribe({
        next: () => {
          this.showSuccess('Fornecedor salvo com sucesso!');
          this.cancelarEdicao();
          this.listarFornecedores();
        },
        error: err => this.showError(err?.error?.msgErro?.[0] || 'Erro ao salvar fornecedor')
      });
    }
  }

  // ================= LISTAR =================
  listarFornecedores(): void {
    this.fornecedorService.listar().subscribe(res => this.fornecedores = res.resposta || res || []);
  }

  // ================= EDITAR =================
editarFornecedor(fornecedor: FornecedorDTO): void {
  if (!fornecedor.id) return;

  this.fornecedorService.buscarPorId(fornecedor.id).subscribe(res => {
    const f: FornecedorDTO = res.resposta;
    this.editando = true;
    this.fornecedorIdEdit = f.id;

    // =================== FORM PRINCIPAL ===================
    this.form.patchValue({
      id: f.id,
      nome: f.nome,
      identificacao: f.identificacao,
      email: f.email,
      ativo: f.ativo
    });

    // =================== TELEFONES ===================
    this.telefones.clear();
    f.telefones?.forEach((tel: TelefoneDTO) => {
      const tipo = this.tiposTelefone.find(t => t.id === tel.tpTelefone?.id) || null;
      this.telefones.push(this.fb.group({
        id: [tel.id || null],
        numero: [tel.numero || '', Validators.required],
        tpTelefone: [tipo, Validators.required]
      }));
    });
    if (this.telefones.length === 0) this.addTelefone();

    // =================== ENDEREÇOS ===================
    this.enderecos.clear();
    f.enderecos?.forEach((end: EnderecoDTO) => {
      const tipoEnd = this.tiposEndereco.find(t => t.id === end.tipoEndereco?.id) || null;
      this.enderecos.push(this.fb.group({
        id: [end.id || null],
        logradouro: [end.logradouro || '', Validators.required],
        numero: [end.numero || '', Validators.required],
        complemento: [end.complemento || ''],
        bairro: [end.bairro || '', Validators.required],
        cidade: [end.cidade || '', Validators.required],
        estado: [end.estado || '', Validators.required],
        uf: [end.uf?.trim().toUpperCase() || '', Validators.required], // garante match com <option>
        cep: [end.cep || '', Validators.required],
        tipoEndereco: [tipoEnd, Validators.required]
      }));
    });
    if (this.enderecos.length === 0) this.addEndereco();

    this.form.updateValueAndValidity();
  });
}


  // ================= CANCELAR =================
  cancelarEdicao(): void {
    this.editando = false;
    this.fornecedorIdEdit = undefined;
    this.form.reset({ ativo: true });
    this.telefones.clear();
    this.enderecos.clear();
    if (this.telefones.length === 0) this.addTelefone();
    if (this.enderecos.length === 0) this.addEndereco();
  }

  // ================= MENSAGENS =================
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

  // ================= COMPARE FUNCTION PARA SELECT =================
  compareById(option: any, value: any): boolean {
    return option && value ? option.id === value.id : option === value;
  }

  onCepBlur(index: number): void {
    const cepControl = this.enderecos.at(index).get('cep');
    const cep = cepControl?.value?.replace(/\D/g, '');
    if (!cep || cep.length !== 8) return;

    this.enderecoService.buscarPorCep(cep).subscribe({
      next: (endereco) => {
        // Atualiza apenas os campos do endereço, mantendo tipo e número
        this.enderecos.at(index).patchValue({
          logradouro: endereco.logradouro,
          bairro: endereco.bairro,
          cidade: endereco.cidade,
          estado: endereco.estado,
          uf: endereco.uf
        });
      },
      error: (err) => {
        console.error('Erro ao buscar CEP', err);
        this.snackBar.open('Não foi possível buscar o CEP', 'Fechar', { duration: 4000, panelClass: ['erro-snackbar'] });
      }
    });
  }

}
