/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAssetTransactionsFilterComponent } from './transactions-filter.component';

describe('FixedAssetTransactionsFilterComponent', () => {
  let component: FixedAssetTransactionsFilterComponent;
  let fixture: ComponentFixture<FixedAssetTransactionsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FixedAssetTransactionsFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedAssetTransactionsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
