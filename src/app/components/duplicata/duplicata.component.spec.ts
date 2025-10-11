import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicataComponent } from './duplicata.component';

describe('DuplicataComponent', () => {
  let component: DuplicataComponent;
  let fixture: ComponentFixture<DuplicataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuplicataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuplicataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
