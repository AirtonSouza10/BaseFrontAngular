import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuLateralComponent } from "../menu-lateral/menu-lateral.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuLateralComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class AppMainComponent {
}
