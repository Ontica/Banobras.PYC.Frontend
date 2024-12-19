/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHeaderComponent } from './order-header.component';

describe('OrderHeaderComponent', () => {
  let component: OrderHeaderComponent;
  let fixture: ComponentFixture<OrderHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
