import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormaPagamentoService, FormaPagamentoDTO } from '../../services/forma-pagamento.service';

@Component({
  selector: 'app-forma-pagamento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forma-pagamento.component.html',
  styleUrls: ['./forma-pagamento.component.css']
})
export class FormaPagamentoComponent implements OnInit {
  form: FormGroup;
  sucessoMsg: string | null = null;
  erroMsg: string | null = null;
  private toastTimeout: any;
  formasPagamento: FormaPagamentoDTO[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly formaPagamentoService: FormaPagamentoService
  ) {
    this.form = this.fb.group({
      descricao: ['', Validators.required],
      qtdeParcelas: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.listarFormasPagamento();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.formaPagamentoService.salvar(this.form.value).subscribe({
        next: () => {
          this.showSuccess('Forma de Pagamento salva com sucesso!');
          this.form.reset({ qtdeParcelas: 1 });
          this.listarFormasPagamento();
        },
        error: (err) => {
          this.showError(err?.error?.resposta?.msgErro?.[0] || 'Erro ao salvar Forma de Pagamento');
        }
      });
    }
  }

  listarFormasPagamento(): void {
    this.formaPagamentoService.listar().subscribe({
      next: (res: any) => {
        this.formasPagamento = res?.resposta || res || [];
      },
      error: (err) => console.error('Erro ao listar formas de pagamento', err)
    });
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
