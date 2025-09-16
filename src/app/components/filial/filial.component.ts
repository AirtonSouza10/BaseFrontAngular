import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilialService, FilialDTO } from '../../services/filial.service';

@Component({
  selector: 'app-filial',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './filial.component.html',
  styleUrls: ['./filial.component.css']
})
export class FilialComponent {
  form: FormGroup;
  filiais: FilialDTO[] = [];
  sucessoMsg: string | null = null;
  erroMsg: string | null = null;
  private toastTimeout: any;

  constructor(
    private fb: FormBuilder,
    private filialService: FilialService
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      identificacao: ['', Validators.required],
      tpidentificacao: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.listarFiliais();
  }

  onSubmit() {
    if (this.form.valid) {
      this.filialService.salvarFilial(this.form.value).subscribe({
        next: res => {
          this.showSuccess(res?.resposta?.msgSucesso?.[0] || 'Filial salva com sucesso!');
          this.form.reset();
          this.listarFiliais();
        },
        error: err => {
          this.showError(err?.error?.resposta?.msgErro?.[0] || 'Erro ao salvar filial');
        }
      });
    }
  }

  listarFiliais() {
    this.filialService.listarFiliais().subscribe({
      next: res => this.filiais = res?.resposta || [],
      error: err => console.error('Erro ao listar filiais', err)
    });
  }

  private showSuccess(message: string) {
    this.sucessoMsg = message;
    this.erroMsg = null;
    this.clearToast();
    this.toastTimeout = setTimeout(() => this.sucessoMsg = null, 4000);
  }

  private showError(message: string) {
    this.erroMsg = message;
    this.sucessoMsg = null;
    this.clearToast();
    this.toastTimeout = setTimeout(() => this.erroMsg = null, 4000);
  }

  private clearToast() {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
  }
}
