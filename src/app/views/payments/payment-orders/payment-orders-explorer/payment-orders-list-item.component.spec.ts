/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOrdersListItemComponent } from './payment-orders-list-item.component';

describe('PaymentOrdersListItemComponent', () => {
  let component: PaymentOrdersListItemComponent;
  let fixture: ComponentFixture<PaymentOrdersListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentOrdersListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentOrdersListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
