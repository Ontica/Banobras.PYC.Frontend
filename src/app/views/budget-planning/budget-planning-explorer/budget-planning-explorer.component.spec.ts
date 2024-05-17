/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetPlanningExplorerComponent } from './budget-planning-explorer.component';

describe('BudgetPlanningExplorerComponent', () => {
  let component: BudgetPlanningExplorerComponent;
  let fixture: ComponentFixture<BudgetPlanningExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetPlanningExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetPlanningExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
