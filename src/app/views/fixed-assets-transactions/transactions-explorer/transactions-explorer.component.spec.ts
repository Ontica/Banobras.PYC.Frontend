/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAssetTransactionsExplorerComponent } from './transactions-explorer.component';

describe('FixedAssetTransactionsExplorerComponent', () => {
  let component: FixedAssetTransactionsExplorerComponent;
  let fixture: ComponentFixture<FixedAssetTransactionsExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FixedAssetTransactionsExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedAssetTransactionsExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
