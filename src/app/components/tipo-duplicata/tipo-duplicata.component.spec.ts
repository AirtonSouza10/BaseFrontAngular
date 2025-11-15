import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoDuplicataComponent } from './tipo-duplicata.component';

describe('TipoDuplicataComponent', () => {
  let component: TipoDuplicataComponent;
  let fixture: ComponentFixture<TipoDuplicataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoDuplicataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoDuplicataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
