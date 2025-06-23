import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { BtnPrimaryComponent } from "../btn-primary/btn-primary.component";
import { NewsFormComponent } from "../news-form/news-form.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, BtnPrimaryComponent, NewsFormComponent],
  providers: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
