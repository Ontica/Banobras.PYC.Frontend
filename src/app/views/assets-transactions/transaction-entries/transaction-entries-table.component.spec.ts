/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransactionEntriesTableComponent } from './transaction-entries-table.component';

describe('AssetTransactionEntriesTableComponent', () => {
  let component: AssetTransactionEntriesTableComponent;
  let fixture: ComponentFixture<AssetTransactionEntriesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetTransactionEntriesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetTransactionEntriesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
