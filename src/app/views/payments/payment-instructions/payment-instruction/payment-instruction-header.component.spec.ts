/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentInstructionHeaderComponent } from './payment-instruction-header.component';

describe('PaymentInstructionHeaderComponent', () => {
  let component: PaymentInstructionHeaderComponent;
  let fixture: ComponentFixture<PaymentInstructionHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentInstructionHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentInstructionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
