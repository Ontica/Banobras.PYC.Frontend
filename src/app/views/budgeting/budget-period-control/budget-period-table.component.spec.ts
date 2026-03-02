/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetPeriodTableComponent } from './budget-period-table.component';

describe('BudgetPeriodTableComponent', () => {
  let component: BudgetPeriodTableComponent;
  let fixture: ComponentFixture<BudgetPeriodTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetPeriodTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetPeriodTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
