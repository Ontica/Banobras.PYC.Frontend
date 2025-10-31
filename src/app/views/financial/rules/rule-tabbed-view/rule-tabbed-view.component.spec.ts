/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialRuleTabbedViewComponent } from './rule-tabbed-view.component';

describe('FinancialRuleTabbedViewComponent', () => {
  let component: FinancialRuleTabbedViewComponent;
  let fixture: ComponentFixture<FinancialRuleTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialRuleTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialRuleTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
