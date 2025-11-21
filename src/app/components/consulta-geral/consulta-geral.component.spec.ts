import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaGeralComponent } from './consulta-geral.component';

describe('ConsultaGeralComponent', () => {
  let component: ConsultaGeralComponent;
  let fixture: ComponentFixture<ConsultaGeralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaGeralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaGeralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
