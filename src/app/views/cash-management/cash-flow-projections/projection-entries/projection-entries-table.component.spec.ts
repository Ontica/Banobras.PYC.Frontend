/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowProjectionEntriesTableComponent } from './projection-entries-table.component';

describe('CashFlowProjectionEntriesTableComponent', () => {
  let component: CashFlowProjectionEntriesTableComponent;
  let fixture: ComponentFixture<CashFlowProjectionEntriesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashFlowProjectionEntriesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowProjectionEntriesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
