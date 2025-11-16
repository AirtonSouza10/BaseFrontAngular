import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioPersonalizadoComponent } from './relatorio-personalizado.component';

describe('RelatorioPersonalizadoComponent', () => {
  let component: RelatorioPersonalizadoComponent;
  let fixture: ComponentFixture<RelatorioPersonalizadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioPersonalizadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatorioPersonalizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
