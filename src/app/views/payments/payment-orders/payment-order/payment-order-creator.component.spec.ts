/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOrderCreatorComponent } from './payment-order-creator.component';

describe('PaymentOrderCreatorComponent', () => {
  let component: PaymentOrderCreatorComponent;
  let fixture: ComponentFixture<PaymentOrderCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentOrderCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentOrderCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
