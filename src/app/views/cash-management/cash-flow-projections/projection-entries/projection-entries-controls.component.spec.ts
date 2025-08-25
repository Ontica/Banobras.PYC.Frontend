/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowProjectionEntriesControlsComponent } from './projection-entries-controls.component';

describe('CashFlowProjectionEntriesControlsComponent', () => {
  let component: CashFlowProjectionEntriesControlsComponent;
  let fixture: ComponentFixture<CashFlowProjectionEntriesControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashFlowProjectionEntriesControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowProjectionEntriesControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
