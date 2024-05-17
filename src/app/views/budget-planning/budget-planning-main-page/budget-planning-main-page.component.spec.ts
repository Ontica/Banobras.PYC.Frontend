/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetPlanningMainPageComponent } from './budget-planning-main-page.component';

describe('BudgetPlanningMainPageComponent', () => {
  let component: BudgetPlanningMainPageComponent;
  let fixture: ComponentFixture<BudgetPlanningMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetPlanningMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetPlanningMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
