/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialRuleCreatorComponent } from './rule-creator.component';

describe('FinancialRuleCreatorComponent', () => {
  let component: FinancialRuleCreatorComponent;
  let fixture: ComponentFixture<FinancialRuleCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialRuleCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialRuleCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
