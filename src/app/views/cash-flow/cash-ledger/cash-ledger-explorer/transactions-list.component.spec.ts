/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashTransactionsListComponent } from './transactions-list.component';

describe('CashTransactionsListComponent', () => {
  let component: CashTransactionsListComponent;
  let fixture: ComponentFixture<CashTransactionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashTransactionsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashTransactionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
