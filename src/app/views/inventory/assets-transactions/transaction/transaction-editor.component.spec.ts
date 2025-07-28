/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsTransactionEditorComponent } from './transaction-editor.component';

describe('AssetsTransactionEditorComponent', () => {
  let component: AssetsTransactionEditorComponent;
  let fixture: ComponentFixture<AssetsTransactionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsTransactionEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsTransactionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
