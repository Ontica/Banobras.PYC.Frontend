/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentInstructionsListItemComponent } from './payment-instructions-list-item.component';

describe('PaymentInstructionsListItemComponent', () => {
  let component: PaymentInstructionsListItemComponent;
  let fixture: ComponentFixture<PaymentInstructionsListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentInstructionsListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentInstructionsListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
