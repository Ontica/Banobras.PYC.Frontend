/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetTransactionHeaderComponent } from './transaction-header.component';

describe('BudgetTransactionHeaderComponent', () => {
  let component: BudgetTransactionHeaderComponent;
  let fixture: ComponentFixture<BudgetTransactionHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetTransactionHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetTransactionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
