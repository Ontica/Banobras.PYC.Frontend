/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOrdersExplorerComponent } from './payment-orders-explorer.component';

describe('PaymentOrdersExplorerComponent', () => {
  let component: PaymentOrdersExplorerComponent;
  let fixture: ComponentFixture<PaymentOrdersExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentOrdersExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentOrdersExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
