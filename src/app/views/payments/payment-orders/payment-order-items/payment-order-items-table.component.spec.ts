/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOrderItemsTableComponent } from './payment-order-items-table.component';

describe('PaymentOrderItemsTableComponent', () => {
  let component: PaymentOrderItemsTableComponent;
  let fixture: ComponentFixture<PaymentOrderItemsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentOrderItemsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentOrderItemsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
