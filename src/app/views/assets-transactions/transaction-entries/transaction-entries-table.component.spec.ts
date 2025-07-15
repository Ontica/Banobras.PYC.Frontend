/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsTransactionEntriesTableComponent } from './transaction-entries-table.component';

describe('AssetsTransactionEntriesTableComponent', () => {
  let component: AssetsTransactionEntriesTableComponent;
  let fixture: ComponentFixture<AssetsTransactionEntriesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsTransactionEntriesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsTransactionEntriesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
