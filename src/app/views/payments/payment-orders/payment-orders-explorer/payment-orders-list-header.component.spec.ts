/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOrdersListHeaderComponent } from './payment-orders-list-header.component';

describe('PaymentOrdersListHeaderComponent', () => {
  let component: PaymentOrdersListHeaderComponent;
  let fixture: ComponentFixture<PaymentOrdersListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentOrdersListHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentOrdersListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
