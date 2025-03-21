/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransactionsListHeaderComponent } from './transactions-list-header.component';

describe('AssetTransactionsListHeaderComponent', () => {
  let component: AssetTransactionsListHeaderComponent;
  let fixture: ComponentFixture<AssetTransactionsListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetTransactionsListHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetTransactionsListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
