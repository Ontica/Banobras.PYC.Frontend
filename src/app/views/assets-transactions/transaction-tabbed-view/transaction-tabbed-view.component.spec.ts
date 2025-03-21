/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransactionTabbedViewComponent } from './transaction-tabbed-view.component';

describe('AssetTransactionTabbedViewComponent', () => {
  let component: AssetTransactionTabbedViewComponent;
  let fixture: ComponentFixture<AssetTransactionTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetTransactionTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetTransactionTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
