/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderOrdersTableComponent } from './order-orders-table.component';

describe('OrderOrdersTableComponent', () => {
  let component: OrderOrdersTableComponent;
  let fixture: ComponentFixture<OrderOrdersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderOrdersTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderOrdersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
