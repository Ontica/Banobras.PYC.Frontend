/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetPlanningFilterComponent } from './budget-planning-filter.component';

describe('BudgetPlanningFilterComponent', () => {
  let component: BudgetPlanningFilterComponent;
  let fixture: ComponentFixture<BudgetPlanningFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetPlanningFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetPlanningFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
