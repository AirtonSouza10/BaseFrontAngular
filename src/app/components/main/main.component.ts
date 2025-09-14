import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class AppMainComponent {
  isSidebarClosed = false;

  constructor(private router: Router) { }

  toggleSidebar(): void {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  logout(): void {
    // Aqui você pode limpar tokens/localStorage, se necessário
    // localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
