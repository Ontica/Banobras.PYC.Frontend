/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionEntriesTableComponent } from './transaction-entries-table.component';

describe('TransactionEntriesTableComponent', () => {
  let component: TransactionEntriesTableComponent;
  let fixture: ComponentFixture<TransactionEntriesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionEntriesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionEntriesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
