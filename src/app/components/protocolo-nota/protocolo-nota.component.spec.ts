import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocoloNotaComponent } from './protocolo-nota.component';

describe('ProtocoloNotaComponent', () => {
  let component: ProtocoloNotaComponent;
  let fixture: ComponentFixture<ProtocoloNotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProtocoloNotaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProtocoloNotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
