/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsOrdersFilterComponent } from './payments-orders-filter.component';

describe('PaymentsOrdersFilterComponent', () => {
  let component: PaymentsOrdersFilterComponent;
  let fixture: ComponentFixture<PaymentsOrdersFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentsOrdersFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsOrdersFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
