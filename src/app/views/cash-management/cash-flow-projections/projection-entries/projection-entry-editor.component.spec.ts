/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowProjectionEntryEditorComponent } from './projection-entry-editor.component';

describe('CashFlowProjectionEntryEditorComponent', () => {
  let component: CashFlowProjectionEntryEditorComponent;
  let fixture: ComponentFixture<CashFlowProjectionEntryEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashFlowProjectionEntryEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowProjectionEntryEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
