import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TipoDuplicataService } from '../../services/tipo-duplicata.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-tipo-duplicata',
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
  templateUrl: './tipo-duplicata.component.html',
  styleUrls: ['./tipo-duplicata.component.css']
})
export class TipoDuplicataComponent implements OnInit {

  form: FormGroup;
  tiposDuplicata: any[] = [];
  displayedColumns: string[] = ['descricao', 'acoes'];

  mensagemSucesso: string = '';
  mensagemErro: string = '';

  editandoId: number | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly tipoDuplicataService: TipoDuplicataService,
    private readonly snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      descricao: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.listarTiposDuplicata();
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    if (this.editandoId) {
      this.atualizarTipoDuplicata();
    } else {
      this.criarTipoDuplicata();
    }
  }

  private criarTipoDuplicata(): void {
    this.tipoDuplicataService.criarTipo(this.form.value).subscribe({
      next: (res: any) => {
        const msg = res.resposta?.msgSucesso?.[0] || 'Dados salvos com sucesso!';
        this.mensagemSucesso = msg;
        this.mensagemErro = '';
        this.form.reset();
        this.listarTiposDuplicata();
        this.snackBar.open(msg, 'Fechar', { duration: 4000, panelClass: ['sucesso-snackbar'] });
      },
      error: (err) => {
        const msg = err?.error?.resposta?.msgErro?.[0] || 'Erro ao cadastrar Tipo de Duplicata';
        this.mensagemErro = msg;
        this.mensagemSucesso = '';
        this.snackBar.open(msg, 'Fechar', { duration: 4000, panelClass: ['erro-snackbar'] });
      }
    });
  }

  private atualizarTipoDuplicata(): void {
    this.tipoDuplicataService.atualizarTipo(this.editandoId!, this.form.value).subscribe({
      next: (res: any) => {
        const msg = res.resposta?.msgSucesso?.[0] || 'Dados atualizados com sucesso!';
        this.mensagemSucesso = msg;
        this.mensagemErro = '';
        this.cancelEdit();
        this.listarTiposDuplicata();
        this.snackBar.open(msg, 'Fechar', { duration: 4000, panelClass: ['sucesso-snackbar'] });
      },
      error: (err) => {
        const msg = err?.error?.resposta?.msgErro?.[0] || 'Erro ao atualizar Tipo de Duplicata';
        this.mensagemErro = msg;
        this.mensagemSucesso = '';
        this.snackBar.open(msg, 'Fechar', { duration: 4000, panelClass: ['erro-snackbar'] });
      }
    });
  }

  private listarTiposDuplicata(): void {
    this.tipoDuplicataService.listarTipos().subscribe({
      next: (res: any) => { this.tiposDuplicata = res?.resposta || []; },
      error: (err) => { console.error('Erro ao listar tipos de duplicata', err); }
    });
  }

  excluirTipoDuplicata(id: number, descricao: string): void {
    if (!confirm(`Tem certeza que deseja excluir o tipo "${descricao}"?`)) return;

    this.tipoDuplicataService.deletarTipo(id).subscribe({
      next: (res: any) => {
        const msg = res.resposta?.msgSucesso?.[0] || 'Tipo excluído com sucesso!';
        this.mensagemSucesso = msg;
        this.mensagemErro = '';
        this.listarTiposDuplicata();
        this.snackBar.open(msg, 'Fechar', { duration: 4000, panelClass: ['sucesso-snackbar'] });
      },
      error: (err) => {
        const msg = err?.error?.resposta?.msgErro?.[0] || 'Não foi possível excluir. Verifique se há vínculos.';
        this.mensagemErro = msg;
        this.mensagemSucesso = '';
        this.snackBar.open(msg, 'Fechar', { duration: 4000, panelClass: ['erro-snackbar'] });
      }
    });
  }

  editarTipoDuplicata(id: number): void {
    this.tipoDuplicataService.buscarPorId(id).subscribe({
      next: (res: any) => {
        const tipo = res.resposta;
        this.form.patchValue({ descricao: tipo.descricao });
        this.editandoId = tipo.id;
      },
      error: (err) => {
        const msg = err?.error?.resposta?.msgErro?.[0] || 'Erro ao carregar Tipo';
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
