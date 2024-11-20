/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAssetTransactionsListComponent } from './transactions-list.component';

describe('FixedAssetTransactionsListComponent', () => {
  let component: FixedAssetTransactionsListComponent;
  let fixture: ComponentFixture<FixedAssetTransactionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FixedAssetTransactionsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedAssetTransactionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
