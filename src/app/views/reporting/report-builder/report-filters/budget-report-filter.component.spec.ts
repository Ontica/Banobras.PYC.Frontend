/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetReportFilterComponent } from './budget-report-filter.component';

describe('BudgetReportFilterComponent', () => {
  let component: BudgetReportFilterComponent;
  let fixture: ComponentFixture<BudgetReportFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetReportFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetReportFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
