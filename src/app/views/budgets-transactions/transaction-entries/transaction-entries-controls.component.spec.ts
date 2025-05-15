/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetTransactionEntriesControlsComponent } from './transaction-entries-controls.component';

describe('BudgetTransactionEntriesControlsComponent', () => {
  let component: BudgetTransactionEntriesControlsComponent;
  let fixture: ComponentFixture<BudgetTransactionEntriesControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetTransactionEntriesControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetTransactionEntriesControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
