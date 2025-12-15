/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOrderHeaderComponent } from './payment-order-header.component';

describe('PaymentOrderHeaderComponent', () => {
  let component: PaymentOrderHeaderComponent;
  let fixture: ComponentFixture<PaymentOrderHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentOrderHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentOrderHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
