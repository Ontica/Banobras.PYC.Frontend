/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashLedgerListComponent } from './cash-ledger-list.component';

describe('CashLedgerListComponent', () => {
  let component: CashLedgerListComponent;
  let fixture: ComponentFixture<CashLedgerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashLedgerListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashLedgerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
