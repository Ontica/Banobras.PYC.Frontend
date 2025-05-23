/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowProjectionEditorComponent } from './projection-editor.component';

describe('CashFlowProjectionEditorComponent', () => {
  let component: CashFlowProjectionEditorComponent;
  let fixture: ComponentFixture<CashFlowProjectionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashFlowProjectionEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowProjectionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
