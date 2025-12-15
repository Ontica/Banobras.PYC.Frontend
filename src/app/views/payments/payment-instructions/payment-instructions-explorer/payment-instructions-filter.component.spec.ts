/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentInstructionsFilterComponent } from './payment-instructions-filter.component';

describe('PaymentInstructionsFilterComponent', () => {
  let component: PaymentInstructionsFilterComponent;
  let fixture: ComponentFixture<PaymentInstructionsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentInstructionsFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentInstructionsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
