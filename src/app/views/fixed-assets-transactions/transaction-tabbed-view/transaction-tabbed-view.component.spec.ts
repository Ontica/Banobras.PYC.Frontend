/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAssetTransactionTabbedViewComponent } from './transaction-tabbed-view.component';

describe('FixedAssetTransactionTabbedViewComponent', () => {
  let component: FixedAssetTransactionTabbedViewComponent;
  let fixture: ComponentFixture<FixedAssetTransactionTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FixedAssetTransactionTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedAssetTransactionTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
