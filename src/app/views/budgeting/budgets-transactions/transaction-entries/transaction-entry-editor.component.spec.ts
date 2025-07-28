/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetTransactionEntryEditorComponent } from './transaction-entry-editor.component';

describe('BudgetTransactionEntryEditorComponent', () => {
  let component: BudgetTransactionEntryEditorComponent;
  let fixture: ComponentFixture<BudgetTransactionEntryEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetTransactionEntryEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetTransactionEntryEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
