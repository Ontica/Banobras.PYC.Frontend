/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentInstructionsMainPageComponent } from './payment-instructions-main-page.component';

describe('PaymentInstructionsMainPageComponent', () => {
  let component: PaymentInstructionsMainPageComponent;
  let fixture: ComponentFixture<PaymentInstructionsMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentInstructionsMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentInstructionsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
