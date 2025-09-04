/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAccountsListComponent } from './accounts-list.component';

describe('FinancialAccountsListComponent', () => {
  let component: FinancialAccountsListComponent;
  let fixture: ComponentFixture<FinancialAccountsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialAccountsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialAccountsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
