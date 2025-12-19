/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAccountEditorComponent } from './payment-account-editor.component';

describe('PaymentAccountEditorComponent', () => {
  let component: PaymentAccountEditorComponent;
  let fixture: ComponentFixture<PaymentAccountEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentAccountEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentAccountEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
