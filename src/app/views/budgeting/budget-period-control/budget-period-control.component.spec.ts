/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetPeriodControlComponent } from './budget-period-control.component';

describe('BudgetPeriodControlComponent', () => {
  let component: BudgetPeriodControlComponent;
  let fixture: ComponentFixture<BudgetPeriodControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetPeriodControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetPeriodControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
