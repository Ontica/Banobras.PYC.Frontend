/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialProjectTabbedViewComponent } from './project-tabbed-view.component';

describe('FinancialProjectTabbedViewComponent', () => {
  let component: FinancialProjectTabbedViewComponent;
  let fixture: ComponentFixture<FinancialProjectTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialProjectTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialProjectTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
