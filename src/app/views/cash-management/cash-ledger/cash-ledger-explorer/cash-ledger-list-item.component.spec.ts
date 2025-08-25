/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashLedgerListItemComponent } from './cash-ledger-list-item.component';

describe('CashLedgerListItemComponent', () => {
  let component: CashLedgerListItemComponent;
  let fixture: ComponentFixture<CashLedgerListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashLedgerListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashLedgerListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
