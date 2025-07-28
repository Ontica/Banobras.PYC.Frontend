/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetTransactionsListComponent } from './transactions-list.component';

describe('BudgetTransactionsListComponent', () => {
  let component: BudgetTransactionsListComponent;
  let fixture: ComponentFixture<BudgetTransactionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetTransactionsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetTransactionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
