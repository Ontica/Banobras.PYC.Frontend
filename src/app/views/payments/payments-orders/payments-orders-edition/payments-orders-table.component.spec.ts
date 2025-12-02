/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsOrdersTableComponent } from './payments-orders-table.component';

describe('PaymentsOrdersTableComponent', () => {
  let component: PaymentsOrdersTableComponent;
  let fixture: ComponentFixture<PaymentsOrdersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentsOrdersTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsOrdersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
