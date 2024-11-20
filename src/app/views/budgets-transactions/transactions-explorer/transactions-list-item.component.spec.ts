/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetTransactionsListItemComponent } from './transactions-list-item.component';

describe('BudgetTransactionsListItemComponent', () => {
  let component: BudgetTransactionsListItemComponent;
  let fixture: ComponentFixture<BudgetTransactionsListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetTransactionsListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetTransactionsListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
