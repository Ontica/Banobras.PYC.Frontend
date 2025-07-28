/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowProjectionPrintViewComponent } from './projection-print-view.component';

describe('CashFlowProjectionPrintViewComponent', () => {
  let component: CashFlowProjectionPrintViewComponent;
  let fixture: ComponentFixture<CashFlowProjectionPrintViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashFlowProjectionPrintViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashFlowProjectionPrintViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
