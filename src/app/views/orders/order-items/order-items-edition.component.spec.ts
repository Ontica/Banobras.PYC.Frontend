/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemsEditionComponent } from './order-items-edition.component';

describe('OrderItemsEditionComponent', () => {
  let component: OrderItemsEditionComponent;
  let fixture: ComponentFixture<OrderItemsEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderItemsEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderItemsEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
