/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashLedgerExplorerComponent } from './cash-ledger-explorer.component';

describe('CashLedgerExplorerComponent', () => {
  let component: CashLedgerExplorerComponent;
  let fixture: ComponentFixture<CashLedgerExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashLedgerExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashLedgerExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
