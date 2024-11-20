/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetTransactionEntriesEditionComponent } from './transaction-entries-edition.component';

describe('BudgetTransactionEntriesEditionComponent', () => {
  let component: BudgetTransactionEntriesEditionComponent;
  let fixture: ComponentFixture<BudgetTransactionEntriesEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetTransactionEntriesEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetTransactionEntriesEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
