/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOrdersMainPageComponent } from './payment-orders-main-page.component';

describe('PaymentOrdersMainPageComponent', () => {
  let component: PaymentOrdersMainPageComponent;
  let fixture: ComponentFixture<PaymentOrdersMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentOrdersMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentOrdersMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
