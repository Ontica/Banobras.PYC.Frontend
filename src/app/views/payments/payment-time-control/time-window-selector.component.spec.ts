import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTimeWindowSelectorComponent } from './time-window-selector.component';

describe('PaymentTimeWindowSelectorComponent', () => {
  let component: PaymentTimeWindowSelectorComponent;
  let fixture: ComponentFixture<PaymentTimeWindowSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentTimeWindowSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentTimeWindowSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
