import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-lateral',
  standalone: true, // precisa disso para usar 'imports'
  imports: [CommonModule, RouterModule], // importa NgIf/NgFor e routerLink
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css'] // plural
})
export class MenuLateralComponent {
  isSidebarClosed = false;
  expandedMenu: string | null = null;

  constructor(private readonly router: Router, private readonly route: ActivatedRoute) {}

  toggleSidebar(): void {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  toggleMenu(menu: string) {
    this.expandedMenu = this.expandedMenu === menu ? null : menu;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
