/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetTransactionsRelatedListComponent } from './transactions-related-list.component';

describe('BudgetTransactionsRelatedListComponent', () => {
  let component: BudgetTransactionsRelatedListComponent;
  let fixture: ComponentFixture<BudgetTransactionsRelatedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetTransactionsRelatedListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetTransactionsRelatedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
