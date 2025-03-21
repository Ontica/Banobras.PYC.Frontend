/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransactionsFilterComponent } from './transactions-filter.component';

describe('AssetTransactionsFilterComponent', () => {
  let component: AssetTransactionsFilterComponent;
  let fixture: ComponentFixture<AssetTransactionsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetTransactionsFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetTransactionsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
