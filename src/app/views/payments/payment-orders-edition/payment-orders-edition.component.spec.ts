/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOrdersEditionComponent } from './payment-orders-edition.component';

describe('PaymentOrdersEditionComponent', () => {
  let component: PaymentOrdersEditionComponent;
  let fixture: ComponentFixture<PaymentOrdersEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentOrdersEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentOrdersEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
