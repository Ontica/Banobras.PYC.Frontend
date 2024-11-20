/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAssetTransactionEditorComponent } from './transaction-editor.component';

describe('FixedAssetTransactionEditorComponent', () => {
  let component: FixedAssetTransactionEditorComponent;
  let fixture: ComponentFixture<FixedAssetTransactionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FixedAssetTransactionEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedAssetTransactionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
