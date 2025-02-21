/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetTransactionCreatorComponent } from './transaction-creator.component';

describe('BudgetTransactionCreatorComponent', () => {
  let component: BudgetTransactionCreatorComponent;
  let fixture: ComponentFixture<BudgetTransactionCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetTransactionCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetTransactionCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
