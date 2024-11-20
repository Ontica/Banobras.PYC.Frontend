/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetTransactionTabbedViewComponent } from './transaction-tabbed-view.component';

describe('BudgetTransactionTabbedViewComponent', () => {
  let component: BudgetTransactionTabbedViewComponent;
  let fixture: ComponentFixture<BudgetTransactionTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetTransactionTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetTransactionTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
