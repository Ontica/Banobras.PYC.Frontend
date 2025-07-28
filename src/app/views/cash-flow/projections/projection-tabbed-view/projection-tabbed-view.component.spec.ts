/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowProjectionTabbedViewComponent } from './projection-tabbed-view.component';

describe('CashFlowProjectionTabbedViewComponent', () => {
  let component: CashFlowProjectionTabbedViewComponent;
  let fixture: ComponentFixture<CashFlowProjectionTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashFlowProjectionTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowProjectionTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
