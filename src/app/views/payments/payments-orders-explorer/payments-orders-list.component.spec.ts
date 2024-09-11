/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsOrdersListComponent } from './payments-orders-list.component';

describe('PaymentsOrdersListComponent', () => {
  let component: PaymentsOrdersListComponent;
  let fixture: ComponentFixture<PaymentsOrdersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentsOrdersListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsOrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
