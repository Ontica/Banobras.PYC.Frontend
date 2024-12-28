/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemEditorComponent } from './order-item-editor.component';

describe('OrderItemEditorComponent', () => {
  let component: OrderItemEditorComponent;
  let fixture: ComponentFixture<OrderItemEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderItemEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderItemEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
