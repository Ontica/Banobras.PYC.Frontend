/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransactionEntriesEditionComponent } from './transaction-entries-edition.component';

describe('AssetTransactionEntriesEditionComponent', () => {
  let component: AssetTransactionEntriesEditionComponent;
  let fixture: ComponentFixture<AssetTransactionEntriesEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetTransactionEntriesEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetTransactionEntriesEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
