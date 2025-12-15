/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentInstructionsListHeaderComponent } from './payment-instructions-list-header.component';

describe('PaymentInstructionsListHeaderComponent', () => {
  let component: PaymentInstructionsListHeaderComponent;
  let fixture: ComponentFixture<PaymentInstructionsListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentInstructionsListHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentInstructionsListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
