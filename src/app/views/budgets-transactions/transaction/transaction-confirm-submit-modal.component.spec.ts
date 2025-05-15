/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetTransactionConfirmSubmitModalComponent } from './transaction-confirm-submit-modal.component';

describe('BudgetTransactionConfirmSubmitModalComponent', () => {
  let component: BudgetTransactionConfirmSubmitModalComponent;
  let fixture: ComponentFixture<BudgetTransactionConfirmSubmitModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetTransactionConfirmSubmitModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetTransactionConfirmSubmitModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
