/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetTransactionEditorComponent } from './transaction-editor.component';

describe('BudgetTransactionEditorComponent', () => {
  let component: BudgetTransactionEditorComponent;
  let fixture: ComponentFixture<BudgetTransactionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetTransactionEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetTransactionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
