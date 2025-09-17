import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FornecedorService, FornecedorDTO } from '../../services/fornecedor.service';
import { TipoService } from '../../services/tipo.service';

@Component({
  selector: 'app-fornecedor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
  private toastTimeout: any;

  constructor(
    private readonly fb: FormBuilder,
    private readonly fornecedorService: FornecedorService,
    private readonly tipoService: TipoService,
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      identificacao: ['', Validators.required],
      tpIdentificacao: ['', Validators.required],
      email: [''],
      telefones: this.fb.array([]),
      enderecos: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.listarFornecedores();
    this.tipoService.listarTiposTelefone().subscribe(res => this.tiposTelefone = res.resposta);
    this.tipoService.listarTiposEndereco().subscribe(res => this.tiposEndereco = res.resposta);
    this.addTelefone();
    this.addEndereco();
  }

  get telefones(): FormArray {
    return this.form.get('telefones') as FormArray;
  }

  get enderecos(): FormArray {
    return this.form.get('enderecos') as FormArray;
  }

  addTelefone(): void {
    this.telefones.push(this.fb.group({
      numero: ['', Validators.required],
      tpTelefoneId: [null, Validators.required]
    }));
  }

  removeTelefone(index: number): void {
    this.telefones.removeAt(index);
  }

  addEndereco(): void {
    this.enderecos.push(this.fb.group({
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      uf: ['', Validators.required],
      cep: ['', Validators.required],
      enderecoTipoId: [null, Validators.required]
    }));
  }

  removeEndereco(index: number): void {
    this.enderecos.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.fornecedorService.salvar(this.form.value).subscribe({
        next: () => {
          this.showSuccess('Fornecedor salvo com sucesso!');
          this.form.reset();
          this.telefones.clear();
          this.enderecos.clear();
          this.addTelefone();
          this.addEndereco();
          this.listarFornecedores();
        },
        error: err => this.showError(err?.error?.resposta?.msgErro?.[0] || 'Erro ao salvar fornecedor')
      });
    }
  }

  listarFornecedores(): void {
    this.fornecedorService.listar().subscribe(res => this.fornecedores = res.resposta || res || []);
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
}
