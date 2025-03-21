/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransactionHeaderComponent } from './transaction-header.component';

describe('AssetTransactionHeaderComponent', () => {
  let component: AssetTransactionHeaderComponent;
  let fixture: ComponentFixture<AssetTransactionHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetTransactionHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetTransactionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
