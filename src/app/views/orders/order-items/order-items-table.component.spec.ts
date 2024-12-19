/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemsTableComponent } from './order-items-table.component';

describe('OrderItemsTableComponent', () => {
  let component: OrderItemsTableComponent;
  let fixture: ComponentFixture<OrderItemsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderItemsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderItemsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
