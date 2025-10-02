/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowReportMainPageComponent } from './cash-flow-report-main-page.component';

describe('CashFlowReportMainPageComponent', () => {
  let component: CashFlowReportMainPageComponent;
  let fixture: ComponentFixture<CashFlowReportMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashFlowReportMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowReportMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
