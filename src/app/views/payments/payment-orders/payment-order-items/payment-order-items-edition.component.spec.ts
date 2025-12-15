/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOrderItemsEditionComponent } from './payment-order-items-edition.component';

describe('PaymentOrderItemsEditionComponent', () => {
  let component: PaymentOrderItemsEditionComponent;
  let fixture: ComponentFixture<PaymentOrderItemsEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentOrderItemsEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentOrderItemsEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
