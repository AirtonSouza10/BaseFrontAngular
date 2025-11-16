import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocoloContaPagaComponent } from './protocolo-conta-paga.component';

describe('ProtocoloContaPagaComponent', () => {
  let component: ProtocoloContaPagaComponent;
  let fixture: ComponentFixture<ProtocoloContaPagaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProtocoloContaPagaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProtocoloContaPagaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
