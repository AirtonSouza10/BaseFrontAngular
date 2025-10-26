import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UsuarioDTO, AuthService, AlterarSenhaDTO } from '../../services/auth.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  form!: FormGroup;
  senhaForm!: FormGroup;
  usuarios = new MatTableDataSource<UsuarioDTO>();
  displayedColumns = ['nome', 'identificacao', 'email', 'telefone', 'ativo', 'acoes'];
  sucessoMsg: string = '';
  erroMsg: string = '';
  editandoUsuarioId?: number;
  modalSenhaAberto = false;
  private toastTimeout: any;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      identificacao: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      senha: ['', [Validators.minLength(6)]], // senha obrigatória apenas se cadastrar
    });

    this.senhaForm = this.fb.group({
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
    });

    this.listarUsuarios();
  }

  /** SUBMIT FORM */
  public onSubmit(): void {
    if (this.form.invalid) return;

    const usuario: UsuarioDTO = this.form.value;

    if (this.editandoUsuarioId) {
      this.authService.atualizarUsuario(this.editandoUsuarioId, usuario).subscribe({
        next: () => {
          this.showSuccess('Usuário atualizado com sucesso!');
          this.cancelarEdicao();
          this.listarUsuarios();
        },
        error: () => this.showError('Erro ao atualizar usuário')
      });
    } else {
      this.authService.registrar(usuario).subscribe({
        next: () => {
          this.showSuccess('Usuário cadastrado com sucesso!');
          this.form.reset();
          this.listarUsuarios();
        },
        error: () => this.showError('Erro ao cadastrar usuário')
      });
    }
  }

  /** LISTA USUÁRIOS */
  listarUsuarios(): void {
    this.authService.listarUsuarios().subscribe({
      next: res => {
        this.usuarios.data = res?.resposta || [];
        this.usuarios._updateChangeSubscription();
      },
      error: err => console.error(err)
    });
  }

  /** TOGGLE ATIVO */
  toggleAtivo(usuario: UsuarioDTO) {
    if (!usuario.id) return;
    this.authService.atualizarStatusUsuario(usuario.id, !usuario.ativo).subscribe({
      next: () => {
        this.showSuccess(`Usuário ${usuario.ativo ? 'inativado' : 'ativado'} com sucesso!`);
        this.listarUsuarios();
      },
      error: () => this.showError('Erro ao atualizar status do usuário')
    });
  }

  /** EDITAR */
  editarUsuario(usuario: UsuarioDTO) {
    this.editandoUsuarioId = usuario.id;
    this.form.patchValue({
      nome: usuario.nome,
      identificacao: usuario.identificacao,
      email: usuario.email,
      telefone: usuario.telefone,
      senha: ''
    });
  }

  /** CANCELAR EDIÇÃO */
  cancelarEdicao() {
    this.editandoUsuarioId = undefined;
    this.form.reset();
  }

  /** MODAL ALTERAR SENHA */
  abrirModalSenha(usuario: UsuarioDTO) {
    this.editandoUsuarioId = usuario.id;
    this.modalSenhaAberto = true;
    this.senhaForm.reset();
  }

  fecharModalSenha() {
    this.modalSenhaAberto = false;
    this.editandoUsuarioId = undefined;
  }

  alterarSenha() {
    if (this.senhaForm.invalid) return;
    const { novaSenha, confirmarSenha } = this.senhaForm.value;
    if (novaSenha !== confirmarSenha) return;

    const dto: AlterarSenhaDTO = { senhaAtual: '', novaSenha };
    this.authService.alterarSenha(this.editandoUsuarioId!, dto).subscribe({
      next: () => {
        this.showSuccess('Senha alterada com sucesso!');
        this.fecharModalSenha();
      },
      error: () => this.showError('Erro ao alterar senha')
    });
  }

  /** MENSAGENS */
  private showSuccess(msg: string) {
    this.sucessoMsg = msg;
    this.erroMsg = '';
    this.clearToast();
    this.toastTimeout = setTimeout(() => (this.sucessoMsg = ''), 4000);
  }

  private showError(msg: string) {
    this.erroMsg = msg;
    this.sucessoMsg = '';
    this.clearToast();
    this.toastTimeout = setTimeout(() => (this.erroMsg = ''), 4000);
  }

  private clearToast() {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
  }
}
