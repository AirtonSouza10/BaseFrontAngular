import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SituacaoService, SituacaoDTO } from '../../services/situacao.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-situacao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './situacao.component.html',
  styleUrls: ['./situacao.component.css']
})
export class SituacaoComponent {
  form: FormGroup;
  sucessoMsg: string | null = null;
  erroMsg: string | null = null;
  tiposSituacao: SituacaoDTO[] = [];
  private toastTimeout: any;

  constructor(
    private readonly fb: FormBuilder,
    private readonly situacaoService: SituacaoService
  ) {
    this.form = this.fb.group({
      descricao: ['', Validators.required],
    });

    this.listarSituacoes();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.situacaoService.salvar(this.form.value).subscribe({
        next: (res: any) => {
          this.showSuccess(res?.resposta?.msgSucesso?.[0] || 'Dados salvos com sucesso!');
          this.form.reset();
          this.listarSituacoes(); // atualiza a lista
        },
        error: (err) => {
          this.showError(err?.error?.resposta?.msgErro?.[0] || 'Erro ao salvar situação');
        }
      });
    }
  }

  private listarSituacoes(): void {
    this.situacaoService.listarSituacoes().subscribe({
      next: (res: any) => this.tiposSituacao = res?.resposta || [],
      error: (err) => console.error('Erro ao listar situações', err)
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
