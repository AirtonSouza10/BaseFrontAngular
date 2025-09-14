import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TipoNotaService } from '../../services/tipo-nota.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tipo-nota',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tipo-nota.component.html',
  styleUrls: ['./tipo-nota.component.css']
})
export class TipoNotaComponent {
  form: FormGroup;
  sucessoMsg: string | null = null;
  erroMsg: string | null = null;

  private toastTimeout: any;
  tiposNota: any;

  constructor(
    private readonly fb: FormBuilder,
    private readonly tipoNotaService: TipoNotaService
  ) {
    this.form = this.fb.group({
      descricao: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.tipoNotaService.salvar(this.form.value).subscribe({
        next: (res: any) => {
          // Mostra mensagem de sucesso e desaparece depois de 4 segundos
          this.showSuccess(res?.resposta?.msgSucesso?.[0] || 'Dados salvos com sucesso!');
          this.form.reset();
        },
        error: (err) => {
          // Mostra mensagem de erro e desaparece depois de 4 segundos
          this.showError(err?.error?.resposta?.msgErro?.[0] || 'Erro ao cadastrar Tipo de Nota');
        }
      });
    }
  }

  private listarTiposNota(): void {
    this.tipoNotaService.listarTiposNota().subscribe({
      next: (res: any) => {
        this.tiposNota = res?.resposta || [];
      },
      error: (err) => {
        console.error('Erro ao listar tipos de nota', err);
      }
    });
  }

  private showSuccess(message: string) {
    this.sucessoMsg = message;
    this.erroMsg = null;
    this.clearToast();
    this.toastTimeout = setTimeout(() => this.sucessoMsg = null, 4000); // desaparece em 4s
  }

  private showError(message: string) {
    this.erroMsg = message;
    this.sucessoMsg = null;
    this.clearToast();
    this.toastTimeout = setTimeout(() => this.erroMsg = null, 4000); // desaparece em 4s
  }

  private clearToast() {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }
}
