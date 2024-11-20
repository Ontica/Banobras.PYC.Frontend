/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetTransactionEntriesTableComponent } from './transaction-entries-table.component';

describe('BudgetTransactionEntriesTableComponent', () => {
  let component: BudgetTransactionEntriesTableComponent;
  let fixture: ComponentFixture<BudgetTransactionEntriesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetTransactionEntriesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetTransactionEntriesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
