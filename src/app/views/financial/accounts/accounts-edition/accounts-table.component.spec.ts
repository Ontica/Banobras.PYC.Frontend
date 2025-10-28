/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAccountsTableComponent } from './accounts-table.component';

describe('FinancialAccountsTableComponent', () => {
  let component: FinancialAccountsTableComponent;
  let fixture: ComponentFixture<FinancialAccountsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialAccountsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialAccountsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
