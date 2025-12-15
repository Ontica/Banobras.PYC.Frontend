/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOrdersFilterComponent } from './payment-orders-filter.component';

describe('PaymentOrdersFilterComponent', () => {
  let component: PaymentOrdersFilterComponent;
  let fixture: ComponentFixture<PaymentOrdersFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentOrdersFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentOrdersFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
