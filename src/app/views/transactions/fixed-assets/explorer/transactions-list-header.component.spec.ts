/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAssetTransactionsListHeaderComponent } from './transactions-list-header.component';

describe('FixedAssetTransactionsListHeaderComponent', () => {
  let component: FixedAssetTransactionsListHeaderComponent;
  let fixture: ComponentFixture<FixedAssetTransactionsListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FixedAssetTransactionsListHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedAssetTransactionsListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
