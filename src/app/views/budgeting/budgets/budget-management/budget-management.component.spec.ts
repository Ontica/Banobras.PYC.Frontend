/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetManagementComponent } from './budget-management.component';

describe('BudgetManagementComponent', () => {
  let component: BudgetManagementComponent;
  let fixture: ComponentFixture<BudgetManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
