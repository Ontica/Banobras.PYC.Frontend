/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetTransactionsFilterComponent } from './transactions-filter.component';

describe('BudgetTransactionsFilterComponent', () => {
  let component: BudgetTransactionsFilterComponent;
  let fixture: ComponentFixture<BudgetTransactionsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetTransactionsFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetTransactionsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
