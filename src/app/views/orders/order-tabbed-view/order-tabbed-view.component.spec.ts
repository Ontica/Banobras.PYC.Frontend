/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTabbedViewComponent } from './order-tabbed-view.component';

describe('OrderTabbedViewComponent', () => {
  let component: OrderTabbedViewComponent;
  let fixture: ComponentFixture<OrderTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
