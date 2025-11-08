import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormaPagamentoService, FormaPagamentoDTO } from '../../services/forma-pagamento.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-forma-pagamento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule,
    MatPaginator,
    MatPaginatorModule,
  ],
  templateUrl: './forma-pagamento.component.html',
  styleUrls: ['./forma-pagamento.component.css']
})
export class FormaPagamentoComponent implements OnInit {
  form: FormGroup;
  formasPagamento = new MatTableDataSource<FormaPagamentoDTO>();
  displayedColumns: string[] = ['descricao', 'qtdeParcelas', 'acoes'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;

  mensagemSucesso: string = '';
  mensagemErro: string = '';
  editandoId: number | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly formaPagamentoService: FormaPagamentoService,
    private readonly snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      descricao: ['', Validators.required],
      qtdeParcelas: [1, [Validators.required, Validators.min(1)]],
      prazoPrimeiraParcela: [1, [Validators.required, Validators.min(1)]],
      intervaloParcelas: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.listarFormasPagamentoPaginado();
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    const payload = { ...this.form.value, id: this.editandoId || undefined };

    this.formaPagamentoService.salvar(payload).subscribe({
      next: (res: any) => {
        const msg = res.resposta?.msgSucesso?.[0] || (this.editandoId ? 'Atualizado com sucesso!' : 'Salvo com sucesso!');
        this.mensagemSucesso = msg;
        this.mensagemErro = '';
        this.snackBar.open(msg, 'Fechar', { duration: 4000, panelClass: ['sucesso-snackbar'] });
        this.cancelEdit();
        this.listarFormasPagamentoPaginado();
      },
      error: (err) => {
        const msg = err?.error?.resposta?.msgErro?.[0] || 'Erro ao salvar';
        this.mensagemErro = msg;
        this.mensagemSucesso = '';
        this.snackBar.open(msg, 'Fechar', { duration: 4000, panelClass: ['erro-snackbar'] });
      }
    });
  }

  private listarFormasPagamento(): void {
    this.formaPagamentoService.listar().subscribe({
      next: (res: any) => {
        this.formasPagamento.data = res?.resposta || [];
      },
      error: (err) => { console.error('Erro ao listar formas de pagamento', err); }
    });
  }

  private listarFormasPagamentoPaginado(page: number = 0, size: number = 10): void {
    this.formaPagamentoService.listarPaginados(page, size).subscribe({
      next: (res: any) => {
        const pagina = res?.resposta;
        this.formasPagamento.data = pagina?.content || [];
        this.totalItems = pagina?.totalElements || 0;
        this.pageSize = pagina?.size || 10;
        this.currentPage = pagina?.number || 0;
      },
      error: (err) => {
        console.error('Erro ao listar formas de pagamento paginadas', err);
      }
    });
  }

  onPageChange(event: any): void {
    this.listarFormasPagamentoPaginado(event.pageIndex, event.pageSize);
  }

  excluirFormaPagamento(id: number, descricao: string): void {
    if (confirm(`Tem certeza que deseja excluir a forma de pagamento "${descricao}"?`)) {
      this.formaPagamentoService.excluir(id).subscribe({
        next: (res: any) => {
          const msg = res?.resposta?.msgSucesso?.[0] || 'Excluído com sucesso!';
          this.mensagemSucesso = msg;
          this.mensagemErro = '';

          this.listarFormasPagamentoPaginado();

          this.snackBar.open(msg, 'Fechar', { duration: 4000, panelClass: ['sucesso-snackbar'] });
        },
        error: (err) => {
          const msg = err?.error?.resposta?.msgErro?.[0] || 'Não foi possível excluir.';
          this.mensagemErro = msg;
          this.mensagemSucesso = '';
          this.snackBar.open(msg, 'Fechar', { duration: 4000, panelClass: ['erro-snackbar'] });
        }
      });
    }
  }

  editarFormaPagamento(id: number): void {
    const forma = this.formasPagamento.data.find(f => f.id === id);
    if (forma) {
      this.form.patchValue({
        descricao: forma.descricao,
        qtdeParcelas: forma.qtdeParcelas,
        prazoPrimeiraParcela: forma.prazoPrimeiraParcela,
        intervaloParcelas: forma.intervaloParcelas
      });
      this.editandoId = forma.id!;
    }
  }

  cancelEdit(): void {
    this.editandoId = null;
    this.form.reset({ qtdeParcelas: 1 });
  }
}
