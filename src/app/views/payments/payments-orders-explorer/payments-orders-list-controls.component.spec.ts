/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsOrdersListControlsComponent } from './payments-orders-list-controls.component';

describe('PaymentsOrdersListControlsComponent', () => {
  let component: PaymentsOrdersListControlsComponent;
  let fixture: ComponentFixture<PaymentsOrdersListControlsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentsOrdersListControlsComponent]
    });
    fixture = TestBed.createComponent(PaymentsOrdersListControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
