/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsOrdersListHeaderComponent } from './payments-orders-list-header.component';

describe('PaymentsOrdersListHeaderComponent', () => {
  let component: PaymentsOrdersListHeaderComponent;
  let fixture: ComponentFixture<PaymentsOrdersListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentsOrdersListHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsOrdersListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
