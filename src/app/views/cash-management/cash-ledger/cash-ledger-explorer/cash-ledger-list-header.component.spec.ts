/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashLedgerListHeaderComponent } from './cash-ledger-list-header.component';

describe('CashLedgerListHeaderComponent', () => {
  let component: CashLedgerListHeaderComponent;
  let fixture: ComponentFixture<CashLedgerListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashLedgerListHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashLedgerListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
