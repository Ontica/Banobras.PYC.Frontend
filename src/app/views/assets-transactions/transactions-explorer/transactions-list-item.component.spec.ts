/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransactionsListItemComponent } from './transactions-list-item.component';

describe('AssetTransactionsListItemComponent', () => {
  let component: AssetTransactionsListItemComponent;
  let fixture: ComponentFixture<AssetTransactionsListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetTransactionsListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetTransactionsListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
