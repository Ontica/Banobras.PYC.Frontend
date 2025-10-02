/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowReportFilterComponent } from './cash-flow-report-filter.component';

describe('CashFlowReportFilterComponent', () => {
  let component: CashFlowReportFilterComponent;
  let fixture: ComponentFixture<CashFlowReportFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashFlowReportFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowReportFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
