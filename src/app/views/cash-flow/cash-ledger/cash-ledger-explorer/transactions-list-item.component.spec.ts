/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashTransactionsListItemComponent } from './transactions-list-item.component';

describe('CashTransactionsListItemComponent', () => {
  let component: CashTransactionsListItemComponent;
  let fixture: ComponentFixture<CashTransactionsListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashTransactionsListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashTransactionsListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
