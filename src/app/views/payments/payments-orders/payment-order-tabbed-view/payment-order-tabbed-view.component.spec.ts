/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOrderTabbedViewComponent } from './payment-order-tabbed-view.component';

describe('PaymentOrderTabbedViewComponent', () => {
  let component: PaymentOrderTabbedViewComponent;
  let fixture: ComponentFixture<PaymentOrderTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentOrderTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentOrderTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
