import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TipoPagamentoService, TipoPagamentoDTO } from '../../services/tipo-pagamento.service';

@Component({
  selector: 'app-tipo-pagamento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './tipo-pagamento.component.html',
  styleUrls: ['./tipo-pagamento.component.css']
})
export class TipoPagamentoComponent implements OnInit {
  form: FormGroup;
  tiposPagamento: TipoPagamentoDTO[] = [];
  displayedColumns: string[] = ['descricao', 'acoes'];
  mensagemSucesso: string = '';
  mensagemErro: string = '';
  editandoId: number | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly tipoPagamentoService: TipoPagamentoService,
    private readonly snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      descricao: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.listarTiposPagamento();
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    if (this.editandoId) {
      this.tipoPagamentoService.atualizar(this.editandoId, this.form.value).subscribe({
        next: (res: any) => this.handleSuccess(res?.resposta?.msgSucesso?.[0] || 'Atualizado com sucesso!'),
        error: (err) => this.handleError(err?.error?.resposta?.msgErro?.[0] || 'Erro ao atualizar')
      });
    } else {
      this.tipoPagamentoService.salvar(this.form.value).subscribe({
        next: (res: any) => this.handleSuccess(res?.resposta?.msgSucesso?.[0] || 'Salvo com sucesso!'),
        error: (err) => this.handleError(err?.error?.resposta?.msgErro?.[0] || 'Erro ao salvar')
      });
    }
  }

  listarTiposPagamento(): void {
    this.tipoPagamentoService.listarTiposPagamento().subscribe({
      next: (res: any) => this.tiposPagamento = res?.resposta || [],
      error: (err) => console.error('Erro ao listar', err)
    });
  }

  editarTipoPagamento(id: number): void {
    this.tipoPagamentoService.buscarPorId(id).subscribe({
      next: (res: any) => {
        const tipo = res.resposta;
        this.form.patchValue({ descricao: tipo.descricao });
        this.editandoId = tipo.id;
      },
      error: (err) => this.handleError(err?.error?.resposta?.msgErro?.[0] || 'Erro ao carregar')
    });
  }

  excluirTipoPagamento(id: number, descricao: string): void {
    if (!confirm(`Deseja excluir o tipo de pagamento "${descricao}"?`)) return;

    this.tipoPagamentoService.excluir(id).subscribe({
      next: (res: any) => this.handleSuccess(res?.resposta?.msgSucesso?.[0] || 'Excluído com sucesso!'),
      error: (err) => this.handleError(err?.error?.resposta?.msgErro?.[0] || 'Erro ao excluir')
    });
  }

  cancelEdit(): void {
    this.editandoId = null;
    this.form.reset();
  }

  private handleSuccess(msg: string) {
    this.mensagemSucesso = msg;
    this.mensagemErro = '';
    this.form.reset();
    this.editandoId = null;
    this.listarTiposPagamento();
    this.snackBar.open(msg, 'Fechar', { duration: 4000, panelClass: ['sucesso-snackbar'] });
  }

  private handleError(msg: string) {
    this.mensagemErro = msg;
    this.mensagemSucesso = '';
    this.snackBar.open(msg, 'Fechar', { duration: 4000, panelClass: ['erro-snackbar'] });
  }
}
