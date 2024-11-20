/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAssetTransactionsMainPageComponent } from './transactions-main-page.component';

describe('FixedAssetTransactionsMainPageComponent', () => {
  let component: FixedAssetTransactionsMainPageComponent;
  let fixture: ComponentFixture<FixedAssetTransactionsMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FixedAssetTransactionsMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedAssetTransactionsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
