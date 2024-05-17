/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetFilterComponent } from './budget-filter.component';

describe('BudgetFilterComponent', () => {
  let component: BudgetFilterComponent;
  let fixture: ComponentFixture<BudgetFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
