/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetExplorerComponent } from './budget-explorer.component';

describe('BudgetExplorerComponent', () => {
  let component: BudgetExplorerComponent;
  let fixture: ComponentFixture<BudgetExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
