/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransactionsExplorerComponent } from './transactions-explorer.component';

describe('AssetTransactionsExplorerComponent', () => {
  let component: AssetTransactionsExplorerComponent;
  let fixture: ComponentFixture<AssetTransactionsExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetTransactionsExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetTransactionsExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
