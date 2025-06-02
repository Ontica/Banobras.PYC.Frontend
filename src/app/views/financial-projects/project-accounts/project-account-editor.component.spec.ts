/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialProjectAccountEditorComponent } from './project-account-editor.component';

describe('FinancialProjectAccountEditorComponent', () => {
  let component: FinancialProjectAccountEditorComponent;
  let fixture: ComponentFixture<FinancialProjectAccountEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialProjectAccountEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialProjectAccountEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
