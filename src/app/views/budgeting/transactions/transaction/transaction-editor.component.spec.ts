/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionEditorComponent } from './transaction-editor.component';

describe('TransactionEditorComponent', () => {
  let component: TransactionEditorComponent;
  let fixture: ComponentFixture<TransactionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
