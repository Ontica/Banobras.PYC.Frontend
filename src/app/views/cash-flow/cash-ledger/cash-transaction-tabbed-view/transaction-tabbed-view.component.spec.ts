/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashTransactionTabbedViewComponent } from './transaction-tabbed-view.component';

describe('CashTransactionTabbedViewComponent', () => {
  let component: CashTransactionTabbedViewComponent;
  let fixture: ComponentFixture<CashTransactionTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashTransactionTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashTransactionTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
