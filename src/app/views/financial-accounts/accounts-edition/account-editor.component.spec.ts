/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAccountEditorComponent } from './account-editor.component';

describe('FinancialAccountEditorComponent', () => {
  let component: FinancialAccountEditorComponent;
  let fixture: ComponentFixture<FinancialAccountEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialAccountEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialAccountEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
