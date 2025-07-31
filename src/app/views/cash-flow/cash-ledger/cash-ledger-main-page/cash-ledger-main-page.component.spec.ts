/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashLedgerMainPageComponent } from './cash-ledger-main-page.component';

describe('CashLedgerMainPageComponent', () => {
  let component: CashLedgerMainPageComponent;
  let fixture: ComponentFixture<CashLedgerMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashLedgerMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashLedgerMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
