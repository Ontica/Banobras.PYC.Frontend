/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetTransactionsListHeaderComponent } from './transactions-list-header.component';

describe('BudgetTransactionsListHeaderComponent', () => {
  let component: BudgetTransactionsListHeaderComponent;
  let fixture: ComponentFixture<BudgetTransactionsListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetTransactionsListHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetTransactionsListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
