import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioFilialComponent } from './relatorio-filial.component';

describe('RelatorioFilialComponent', () => {
  let component: RelatorioFilialComponent;
  let fixture: ComponentFixture<RelatorioFilialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioFilialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatorioFilialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
