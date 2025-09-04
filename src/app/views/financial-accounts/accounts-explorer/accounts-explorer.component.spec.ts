/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAccountsExplorerComponent } from './accounts-explorer.component';

describe('FinancialAccountsExplorerComponent', () => {
  let component: FinancialAccountsExplorerComponent;
  let fixture: ComponentFixture<FinancialAccountsExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialAccountsExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialAccountsExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
