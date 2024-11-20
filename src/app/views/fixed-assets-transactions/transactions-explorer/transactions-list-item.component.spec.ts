/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAssetTransactionsListItemComponent } from './transactions-list-item.component';

describe('FixedAssetTransactionsListItemComponent', () => {
  let component: FixedAssetTransactionsListItemComponent;
  let fixture: ComponentFixture<FixedAssetTransactionsListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FixedAssetTransactionsListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedAssetTransactionsListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
