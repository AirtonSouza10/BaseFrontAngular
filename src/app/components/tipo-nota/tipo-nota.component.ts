import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TipoNotaService } from '../../services/tipo-nota.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-tipo-nota',
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
  templateUrl: './tipo-nota.component.html',
  styleUrls: ['./tipo-nota.component.css']
})
export class TipoNotaComponent implements OnInit {
  form: FormGroup;
  tiposNota: any[] = [];
  displayedColumns: string[] = ['descricao', 'acoes'];

  mensagemSucesso: string = '';
  mensagemErro: string = '';

  editandoId: number | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly tipoNotaService: TipoNotaService,
    private readonly snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      descricao: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.listarTiposNota();
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.editandoId) {
        // Atualizar
        this.tipoNotaService.atualizar(this.editandoId, this.form.value).subscribe({
          next: (res: any) => {
            const msg = res.resposta?.msgSucesso?.[0] || 'Dados atualizados com sucesso!';
            this.mensagemSucesso = msg;
            this.mensagemErro = '';
            this.cancelEdit();
            this.listarTiposNota();
            this.snackBar.open(msg, 'Fechar', { duration: 4000, panelClass: ['sucesso-snackbar'] });
          },
          error: (err) => {
            const msg = err?.error?.resposta?.msgErro?.[0] || 'Erro ao atualizar Tipo de Nota';
            this.mensagemErro = msg;
            this.mensagemSucesso = '';
            this.snackBar.open(msg, 'Fechar', { duration: 4000, panelClass: ['erro-snackbar'] });
          }
        });
      } else {
        // Criar novo
        this.tipoNotaService.salvar(this.form.value).subscribe({
          next: (res: any) => {
            const msg = res.resposta?.msgSucesso?.[0] || 'Dados salvos com sucesso!';
            this.mensagemSucesso = msg;
            this.mensagemErro = '';
            this.form.reset();
            this.listarTiposNota();
            this.snackBar.open(msg, 'Fechar', { duration: 4000, panelClass: ['sucesso-snackbar'] });
          },
          error: (err) => {
            const msg = err?.error?.resposta?.msgErro?.[0] || 'Erro ao cadastrar Tipo de Nota';
            this.mensagemErro = msg;
            this.mensagemSucesso = '';
            this.snackBar.open(msg, 'Fechar', { duration: 4000, panelClass: ['erro-snackbar'] });
          }
        });
      }
    }
  }

  private listarTiposNota(): void {
    this.tipoNotaService.listarTiposNota().subscribe({
      next: (res: any) => { this.tiposNota = res?.resposta || []; },
      error: (err) => { console.error('Erro ao listar tipos de nota', err); }
    });
  }

  excluirTipoNota(id: number, descricao: string): void {
    if (confirm(`Tem certeza que deseja excluir o tipo de nota "${descricao}"?`)) {
      this.tipoNotaService.excluir(id).subscribe({
        next: (res: any) => {
          const msg = res.resposta?.msgSucesso?.[0] || 'Tipo de nota excluído com sucesso!';
          this.mensagemSucesso = msg;
          this.mensagemErro = '';
          this.listarTiposNota();
          this.snackBar.open(msg, 'Fechar', { duration: 4000, panelClass: ['sucesso-snackbar'] });
        },
        error: (err) => {
          const msg = err?.error?.resposta?.msgErro?.[0] || 'Não foi possível excluir. Verifique se existem arquivos vinculados.';
          this.mensagemErro = msg;
          this.mensagemSucesso = '';
          this.snackBar.open(msg, 'Fechar', { duration: 4000, panelClass: ['erro-snackbar'] });
        }
      });
    }
  }

  editarTipoNota(id: number): void {
    this.tipoNotaService.buscarPorId(id).subscribe({
      next: (res: any) => {
        const tipo = res.resposta;
        this.form.patchValue({ descricao: tipo.descricao });
        this.editandoId = tipo.id;
      },
      error: (err) => {
        const msg = err?.error?.resposta?.msgErro?.[0] || 'Erro ao carregar Tipo de Nota';
        this.mensagemErro = msg;
        this.mensagemSucesso = '';
        this.snackBar.open(msg, 'Fechar', { duration: 4000, panelClass: ['erro-snackbar'] });
      }
    });
  }

  cancelEdit(): void {
    this.editandoId = null;
    this.form.reset();
  }
}
