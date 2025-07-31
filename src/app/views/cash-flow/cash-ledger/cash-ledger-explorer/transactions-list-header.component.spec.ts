/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashTransactionsListHeaderComponent } from './transactions-list-header.component';

describe('CashTransactionsListHeaderComponent', () => {
  let component: CashTransactionsListHeaderComponent;
  let fixture: ComponentFixture<CashTransactionsListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashTransactionsListHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashTransactionsListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
