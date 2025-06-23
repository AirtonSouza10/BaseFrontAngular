import { Component, Signal } from '@angular/core';
import { BtnPrimaryComponent } from "../btn-primary/btn-primary.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewformService } from '../../services/newform.service';
import { signal } from '@angular/core';

@Component({
  selector: 'news-form',
  standalone: true,
  imports: [
    BtnPrimaryComponent,
    ReactiveFormsModule
  ],
  providers: [
    NewformService
  ],
  templateUrl: './news-form.component.html',
  styleUrl: './news-form.component.css'
})
export class NewsFormComponent {
  newForm!: FormGroup;
  loading = signal(false);

  constructor(private service: NewformService){
    this.newForm = new FormGroup({
      nome: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required, Validators.email]),
    });
  }

  submit(){
    this.loading.set(true);
    if(this.newForm.valid){
      this.service.sendData(this.newForm.value.nome, this.newForm.value.email).subscribe({
        next: () =>{
          this.newForm.reset();
          this.loading.set(false);
        }
      })
    }
  }
}
