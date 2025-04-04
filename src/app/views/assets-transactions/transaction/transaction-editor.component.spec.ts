/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransactionEditorComponent } from './transaction-editor.component';

describe('AssetTransactionEditorComponent', () => {
  let component: AssetTransactionEditorComponent;
  let fixture: ComponentFixture<AssetTransactionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetTransactionEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetTransactionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
