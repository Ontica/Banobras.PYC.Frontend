/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOrdersListComponent } from './payment-orders-list.component';

describe('PaymentOrdersListComponent', () => {
  let component: PaymentOrdersListComponent;
  let fixture: ComponentFixture<PaymentOrdersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentOrdersListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentOrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
