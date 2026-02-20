import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTimeControlModalComponent } from './time-control-modal.component';

describe('PaymentTimeControlModalComponent', () => {
  let component: PaymentTimeControlModalComponent;
  let fixture: ComponentFixture<PaymentTimeControlModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentTimeControlModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentTimeControlModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
