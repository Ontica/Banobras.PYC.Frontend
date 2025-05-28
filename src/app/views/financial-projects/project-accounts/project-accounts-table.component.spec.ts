/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialProjectAccountsTableComponent } from './project-accounts-table.component';

describe('FinancialProjectAccountsTableComponent', () => {
  let component: FinancialProjectAccountsTableComponent;
  let fixture: ComponentFixture<FinancialProjectAccountsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialProjectAccountsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialProjectAccountsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
