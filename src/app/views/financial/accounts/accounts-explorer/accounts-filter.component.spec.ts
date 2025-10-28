/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAccountsFilterComponent } from './accounts-filter.component';

describe('FinancialAccountsFilterComponent', () => {
  let component: FinancialAccountsFilterComponent;
  let fixture: ComponentFixture<FinancialAccountsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialAccountsFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialAccountsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
