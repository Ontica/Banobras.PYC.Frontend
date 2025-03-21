/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransactionsListComponent } from './transactions-list.component';

describe('AssetTransactionsListComponent', () => {
  let component: AssetTransactionsListComponent;
  let fixture: ComponentFixture<AssetTransactionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetTransactionsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetTransactionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
