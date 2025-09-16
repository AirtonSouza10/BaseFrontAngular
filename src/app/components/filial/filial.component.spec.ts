import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilialComponent } from './filial.component';

describe('FilialComponent', () => {
  let component: FilialComponent;
  let fixture: ComponentFixture<FilialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
