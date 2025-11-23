import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelasPrevistasComponent } from './parcelas-previstas.component';

describe('ParcelasPrevistasComponent', () => {
  let component: ParcelasPrevistasComponent;
  let fixture: ComponentFixture<ParcelasPrevistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcelasPrevistasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcelasPrevistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
