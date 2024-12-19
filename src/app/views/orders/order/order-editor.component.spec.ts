/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEditorComponent } from './order-editor.component';

describe('OrderEditorComponent', () => {
  let component: OrderEditorComponent;
  let fixture: ComponentFixture<OrderEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
