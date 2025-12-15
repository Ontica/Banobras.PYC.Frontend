/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentInstructionsExplorerComponent } from './payment-instructions-explorer.component';

describe('PaymentInstructionsExplorerComponent', () => {
  let component: PaymentInstructionsExplorerComponent;
  let fixture: ComponentFixture<PaymentInstructionsExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentInstructionsExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentInstructionsExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
