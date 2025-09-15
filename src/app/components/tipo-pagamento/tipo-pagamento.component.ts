import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TipoPagamentoService, TipoPagamentoDTO } from '../../services/tipo-pagamento.service';

@Component({
  selector: 'app-tipo-pagamento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tipo-pagamento.component.html',
  styleUrls: ['./tipo-pagamento.component.css']
})
export class TipoPagamentoComponent implements OnInit{
  form: FormGroup;
  sucessoMsg: string | null = null;
  erroMsg: string | null = null;
  tiposPagamento: TipoPagamentoDTO[] = [];

  private toastTimeout: any;

  constructor(
    private readonly fb: FormBuilder,
    private readonly tipoPagamentoService: TipoPagamentoService
  ) {
    this.form = this.fb.group({
      descricao: ['', Validators.required],
    });
    this.listarTiposPagamento();
  }
  ngOnInit(): void {
    this.listarTiposPagamento();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.tipoPagamentoService.salvar(this.form.value).subscribe({
        next: (res: any) => {
          this.showSuccess(res?.resposta?.msgSucesso?.[0] || 'Dados salvos com sucesso!');
          this.form.reset();
          this.listarTiposPagamento();
        },
        error: (err) => {
          this.showError(err?.error?.resposta?.msgErro?.[0] || 'Erro ao cadastrar Tipo de Pagamento');
        }
      });
    }
  }

  private listarTiposPagamento(): void {
    this.tipoPagamentoService.listarTiposPagamento().subscribe({
      next: (res: any) => {
        this.tiposPagamento = res?.resposta || [];
      },
      error: (err) => {
        console.error('Erro ao listar tipos de pagamento', err);
      }
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
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }
}
