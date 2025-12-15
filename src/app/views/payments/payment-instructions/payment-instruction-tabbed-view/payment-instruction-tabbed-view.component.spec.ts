/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentInstructionTabbedViewComponent } from './payment-instruction-tabbed-view.component';

describe('PaymentInstructionTabbedViewComponent', () => {
  let component: PaymentInstructionTabbedViewComponent;
  let fixture: ComponentFixture<PaymentInstructionTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentInstructionTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentInstructionTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
