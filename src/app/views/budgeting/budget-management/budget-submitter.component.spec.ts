/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetSubmitterComponent } from './budget-submitter.component';

describe('BudgetSubmitterComponent', () => {
  let component: BudgetSubmitterComponent;
  let fixture: ComponentFixture<BudgetSubmitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetSubmitterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetSubmitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
