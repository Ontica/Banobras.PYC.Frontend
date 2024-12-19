/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersMainPageComponent } from './orders-main-page.component';

describe('OrdersMainPageComponent', () => {
  let component: OrdersMainPageComponent;
  let fixture: ComponentFixture<OrdersMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdersMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
