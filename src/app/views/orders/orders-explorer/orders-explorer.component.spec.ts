/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersExplorerComponent } from './orders-explorer.component';

describe('OrdersExplorerComponent', () => {
  let component: OrdersExplorerComponent;
  let fixture: ComponentFixture<OrdersExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdersExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
