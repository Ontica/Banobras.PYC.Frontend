/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetEntryExplorerComponent } from './budget-entry-explorer.component';

describe('BudgetEntryExplorerComponent', () => {
  let component: BudgetEntryExplorerComponent;
  let fixture: ComponentFixture<BudgetEntryExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetEntryExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetEntryExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
