import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FilialService, FilialDTO } from '../../services/filial.service';

@Component({
  selector: 'app-filial',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './filial.component.html',
  styleUrls: ['./filial.component.css']
})
export class FilialComponent implements OnInit {

  form: FormGroup;
  filiaisData = new MatTableDataSource<FilialDTO>();
  displayedColumns: string[] = ['nome', 'identificacao', 'email', 'ativo', 'acoes']; // removido tipoIdentificacao
  mensagemSucesso: string = '';
  mensagemErro: string = '';
  editandoId: number | null = null;
  private toastTimeout: any;

  constructor(
    private fb: FormBuilder,
    private filialService: FilialService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      identificacao: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.listarFiliais();
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    const formValue = this.form.value;

    const payload: FilialDTO = {
      id: this.editandoId || undefined,
      nome: formValue.nome.trim(),
      identificacao: formValue.identificacao.trim(),
      email: formValue.email.trim(),
      ativo: true
    };

    if (this.editandoId) {
      this.filialService.atualizarFilial(this.editandoId, payload).subscribe({
        next: () => {
          this.showSuccess('Filial atualizada com sucesso!');
          this.listarFiliais(); // Atualiza tabela
        },
        error: () => this.showError('Erro ao atualizar filial')
      });
    } else {
      this.filialService.salvarFilial(payload).subscribe({
        next: () => {
          this.showSuccess('Filial salva com sucesso!');
          this.listarFiliais(); // Atualiza tabela
        },
        error: () => this.showError('Erro ao salvar filial')
      });
    }

    this.cancelEdit();
  }

  editarFilial(filial: FilialDTO): void {
    this.form.patchValue({
      nome: filial.nome,
      identificacao: filial.identificacao,
      email: filial.email
    });

    this.editandoId = filial.id!;
  }

  cancelEdit(): void {
    this.editandoId = null;
    this.form.reset();
  }

  toggleStatus(id: number, ativo: boolean): void {
    this.filialService.atualizarStatusFilial(id, ativo).subscribe({
      next: () => {
        this.showSuccess(`Filial ${ativo ? 'ativada' : 'inativada'} com sucesso!`);
        this.listarFiliais(); // Atualiza tabela
      },
      error: () => this.showError('Erro ao atualizar status')
    });
  }

  listarFiliais(): void {
    this.filialService.listarFiliais().subscribe({
      next: res => {
        const data = res?.resposta || [];
        this.filiaisData.data = [...data]; // cria novo array para disparar detecção
        this.filiaisData._updateChangeSubscription(); // força atualização da tabela
      },
      error: err => console.error('Erro ao listar filiais', err)
    });
  }

  private showSuccess(msg: string) {
    this.mensagemSucesso = msg;
    this.mensagemErro = '';
    this.clearToast();
    this.toastTimeout = setTimeout(() => this.mensagemSucesso = '', 4000);
  }

  private showError(msg: string) {
    this.mensagemErro = msg;
    this.mensagemSucesso = '';
    this.clearToast();
    this.toastTimeout = setTimeout(() => this.mensagemErro = '', 4000);
  }

  private clearToast() {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
  }
}
