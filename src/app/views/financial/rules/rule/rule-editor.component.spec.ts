/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialRuleEditorComponent } from './rule-editor.component';

describe('FinancialRuleEditorComponent', () => {
  let component: FinancialRuleEditorComponent;
  let fixture: ComponentFixture<FinancialRuleEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialRuleEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialRuleEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
