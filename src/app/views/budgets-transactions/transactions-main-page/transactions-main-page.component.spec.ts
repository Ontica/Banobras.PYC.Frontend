/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetTransactionsMainPageComponent } from './transactions-main-page.component';

describe('BudgetTransactionsMainPageComponent', () => {
  let component: BudgetTransactionsMainPageComponent;
  let fixture: ComponentFixture<BudgetTransactionsMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetTransactionsMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetTransactionsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
