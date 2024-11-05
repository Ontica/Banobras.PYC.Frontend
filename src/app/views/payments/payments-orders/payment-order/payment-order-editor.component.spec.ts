/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOrderEditorComponent } from './payment-order-editor.component';

describe('PaymentOrderEditorComponent', () => {
  let component: PaymentOrderEditorComponent;
  let fixture: ComponentFixture<PaymentOrderEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentOrderEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentOrderEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
