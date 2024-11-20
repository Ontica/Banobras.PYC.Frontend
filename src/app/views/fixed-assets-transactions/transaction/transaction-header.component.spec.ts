/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAssetTransactionHeaderComponent } from './transaction-header.component';

describe('FixedAssetTransactionHeaderComponent', () => {
  let component: FixedAssetTransactionHeaderComponent;
  let fixture: ComponentFixture<FixedAssetTransactionHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FixedAssetTransactionHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedAssetTransactionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
