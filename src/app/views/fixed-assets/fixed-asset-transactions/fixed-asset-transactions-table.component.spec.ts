/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAssetTransactionsTableComponent } from './fixed-asset-transactions-table.component';

describe('FixedAssetTransactionsTableComponent', () => {
  let component: FixedAssetTransactionsTableComponent;
  let fixture: ComponentFixture<FixedAssetTransactionsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FixedAssetTransactionsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedAssetTransactionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
