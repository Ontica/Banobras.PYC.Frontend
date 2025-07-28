/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetTransactionsPlanningGeneratorComponent } from './transactions-planning-generator.component';

describe('BudgetTransactionsPlanningGeneratorComponent', () => {
  let component: BudgetTransactionsPlanningGeneratorComponent;
  let fixture: ComponentFixture<BudgetTransactionsPlanningGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetTransactionsPlanningGeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetTransactionsPlanningGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
