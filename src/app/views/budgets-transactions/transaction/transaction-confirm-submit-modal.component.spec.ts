/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionConfirmSubmitModalComponent } from './transaction-confirm-submit-modal.component';

describe('TransactionConfirmSubmitModalComponent', () => {
  let component: TransactionConfirmSubmitModalComponent;
  let fixture: ComponentFixture<TransactionConfirmSubmitModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionConfirmSubmitModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionConfirmSubmitModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
