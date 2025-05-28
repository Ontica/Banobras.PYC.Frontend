/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialProjectEditorComponent } from './project-editor.component';

describe('FinancialProjectEditorComponent', () => {
  let component: FinancialProjectEditorComponent;
  let fixture: ComponentFixture<FinancialProjectEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialProjectEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialProjectEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
