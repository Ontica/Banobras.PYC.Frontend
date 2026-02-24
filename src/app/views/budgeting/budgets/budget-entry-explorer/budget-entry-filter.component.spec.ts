/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetEntryFilterComponent } from './budget-entry-filter.component';

describe('BudgetEntryFilterComponent', () => {
  let component: BudgetEntryFilterComponent;
  let fixture: ComponentFixture<BudgetEntryFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetEntryFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetEntryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
