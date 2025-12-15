/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentInstructionsListComponent } from './payment-instructions-list.component';

describe('PaymentInstructionsListComponent', () => {
  let component: PaymentInstructionsListComponent;
  let fixture: ComponentFixture<PaymentInstructionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentInstructionsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentInstructionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
