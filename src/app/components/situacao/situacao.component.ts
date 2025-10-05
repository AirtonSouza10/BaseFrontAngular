import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableDataSource } from '@angular/material/table';
import { SituacaoService, SituacaoDTO } from '../../services/situacao.service';

@Component({
  selector: 'app-situacao',
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
    MatTooltipModule
  ],
  templateUrl: './situacao.component.html',
  styleUrls: ['./situacao.component.css']
})
export class SituacaoComponent implements OnInit {
  form: FormGroup;
  tiposSituacao = new MatTableDataSource<SituacaoDTO>();
  displayedColumns: string[] = ['descricao', 'acoes'];
  mensagemSucesso: string = '';
  mensagemErro: string = '';
  editandoId: number | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly situacaoService: SituacaoService,
    private readonly snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      descricao: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.listarSituacoes();
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    const payload = { ...this.form.value, id: this.editandoId || undefined };

    this.situacaoService.salvar(payload).subscribe({
      next: (res: any) => {
        const msg = res?.resposta?.msgSucesso?.[0] || (this.editandoId ? 'Atualizado com sucesso!' : 'Salvo com sucesso!');
        this.mensagemSucesso = msg;
        this.mensagemErro = '';
        this.snackBar.open(msg, 'Fechar', { duration: 4000, panelClass: ['sucesso-snackbar'] });
        this.cancelEdit();
        this.listarSituacoes();
      },
      error: (err) => {
        const msg = err?.error?.resposta?.msgErro?.[0] || 'Erro ao salvar situação';
        this.mensagemErro = msg;
        this.mensagemSucesso = '';
        this.snackBar.open(msg, 'Fechar', { duration: 4000, panelClass: ['erro-snackbar'] });
      }
    });
  }

  private listarSituacoes(): void {
    this.situacaoService.listarSituacoes().subscribe({
      next: (res: any) => this.tiposSituacao.data = res?.resposta || [],
      error: (err) => { console.error('Erro ao listar situações', err); }
    });
  }

  excluirSituacao(id: number, descricao: string): void {
    if (confirm(`Tem certeza que deseja excluir a situação "${descricao}"?`)) {
      this.situacaoService.excluir(id).subscribe({
        next: (res: any) => {
          const msg = res?.resposta?.msgSucesso?.[0] || 'Excluído com sucesso!';
          this.mensagemSucesso = msg;
          this.mensagemErro = '';
          this.snackBar.open(msg, 'Fechar', { duration: 4000, panelClass: ['sucesso-snackbar'] });
          this.listarSituacoes();
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

  editarSituacao(id: number): void {
    const situacao = this.tiposSituacao.data.find(f => f.id === id);
    if (situacao) {
      this.form.patchValue({ descricao: situacao.descricao });
      this.editandoId = situacao.id!;
    }
  }

  cancelEdit(): void {
    this.editandoId = null;
    this.form.reset();
  }
}
