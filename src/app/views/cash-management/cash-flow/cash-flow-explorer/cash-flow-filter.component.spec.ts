/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowFilterComponent } from './cash-flow-filter.component';

describe('CashFlowFilterComponent', () => {
  let component: CashFlowFilterComponent;
  let fixture: ComponentFixture<CashFlowFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashFlowFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
