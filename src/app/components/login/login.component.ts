import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; // <-- importar Router

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const credentials = {
        login: this.loginForm.value.username,
        senha: this.loginForm.value.password
      };

      this.authService.login(credentials).subscribe({
        next: (res) => {
          console.log('Login bem-sucedido', res);
          // salvar token, se houver
          localStorage.setItem('token', res.token);

          // redirecionar para a tela principal
          this.router.navigate(['/main']); // agora funciona
        },
        error: (err) => {
          console.error('Erro de login', err);
          this.errorMessage = 'Usuário ou senha inválidos';
        }
      });
    }
  }
}
