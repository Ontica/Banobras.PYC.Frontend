/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowReportExplorerComponent } from './cash-flow-report-explorer.component';

describe('CashFlowReportExplorerComponent', () => {
  let component: CashFlowReportExplorerComponent;
  let fixture: ComponentFixture<CashFlowReportExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashFlowReportExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowReportExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
