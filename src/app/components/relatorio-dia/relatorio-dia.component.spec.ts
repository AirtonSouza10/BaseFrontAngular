import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioDiaComponent } from './relatorio-dia.component';

describe('RelatorioDiaComponent', () => {
  let component: RelatorioDiaComponent;
  let fixture: ComponentFixture<RelatorioDiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioDiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatorioDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
