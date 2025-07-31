/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashLedgerFilterComponent } from './cash-ledger-filter.component';

describe('CashLedgerFilterComponent', () => {
  let component: CashLedgerFilterComponent;
  let fixture: ComponentFixture<CashLedgerFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashLedgerFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashLedgerFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
