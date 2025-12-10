/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOrderRequestComponent } from './payment-order-request.component';

describe('PaymentOrderRequestComponent', () => {
  let component: PaymentOrderRequestComponent;
  let fixture: ComponentFixture<PaymentOrderRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentOrderRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentOrderRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
