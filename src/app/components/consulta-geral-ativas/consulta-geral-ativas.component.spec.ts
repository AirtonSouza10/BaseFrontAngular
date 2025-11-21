import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaGeralAtivasComponent } from './consulta-geral-ativas.component';

describe('ConsultaGeralAtivasComponent', () => {
  let component: ConsultaGeralAtivasComponent;
  let fixture: ComponentFixture<ConsultaGeralAtivasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaGeralAtivasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaGeralAtivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
