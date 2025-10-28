/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialConceptTabbedViewComponent } from './financial-concept-tabbed-view.component';

describe('FinancialConceptTabbedViewComponent', () => {
  let component: FinancialConceptTabbedViewComponent;
  let fixture: ComponentFixture<FinancialConceptTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialConceptTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialConceptTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
