/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAccountsTableComponent } from './payment-accounts-table.component';

describe('PaymentAccountsTableComponent', () => {
  let component: PaymentAccountsTableComponent;
  let fixture: ComponentFixture<PaymentAccountsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentAccountsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentAccountsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
