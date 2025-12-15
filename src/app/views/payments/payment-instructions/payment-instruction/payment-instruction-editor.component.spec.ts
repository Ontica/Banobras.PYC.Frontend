/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentInstructionEditorComponent } from './payment-instruction-editor.component';

describe('PaymentInstructionEditorComponent', () => {
  let component: PaymentInstructionEditorComponent;
  let fixture: ComponentFixture<PaymentInstructionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentInstructionEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentInstructionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
