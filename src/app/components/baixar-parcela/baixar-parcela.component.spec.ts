import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaixarParcelaComponent } from './baixar-parcela.component';

describe('BaixarParcelaComponent', () => {
  let component: BaixarParcelaComponent;
  let fixture: ComponentFixture<BaixarParcelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaixarParcelaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaixarParcelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
