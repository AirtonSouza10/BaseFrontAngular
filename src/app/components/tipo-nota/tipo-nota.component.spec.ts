import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoNotaComponent } from './tipo-nota.component';

describe('TipoNotaComponent', () => {
  let component: TipoNotaComponent;
  let fixture: ComponentFixture<TipoNotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoNotaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoNotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
