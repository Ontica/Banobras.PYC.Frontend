/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransactionsTableComponent } from './asset-transactions-table.component';

describe('AssetTransactionsTableComponent', () => {
  let component: AssetTransactionsTableComponent;
  let fixture: ComponentFixture<AssetTransactionsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetTransactionsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetTransactionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
