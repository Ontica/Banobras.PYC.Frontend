/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowProjectionsFilterComponent } from './projections-filter.component';

describe('CashFlowProjectionsFilterComponent', () => {
  let component: CashFlowProjectionsFilterComponent;
  let fixture: ComponentFixture<CashFlowProjectionsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashFlowProjectionsFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowProjectionsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
