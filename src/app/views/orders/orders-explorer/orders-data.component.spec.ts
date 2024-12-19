/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersDataComponent } from './orders-data.component';

describe('OrdersDataComponent', () => {
  let component: OrdersDataComponent;
  let fixture: ComponentFixture<OrdersDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdersDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
