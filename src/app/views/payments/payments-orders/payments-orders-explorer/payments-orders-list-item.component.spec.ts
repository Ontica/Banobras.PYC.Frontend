/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsOrdersListItemComponent } from './payments-orders-list-item.component';

describe('PaymentsOrdersListItemComponent', () => {
  let component: PaymentsOrdersListItemComponent;
  let fixture: ComponentFixture<PaymentsOrdersListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentsOrdersListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsOrdersListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
