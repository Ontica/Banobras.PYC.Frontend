/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashEntriesAnalysisComponent } from './entries-analysis.component';

describe('CashEntriesAnalysisComponent', () => {
  let component: CashEntriesAnalysisComponent;
  let fixture: ComponentFixture<CashEntriesAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashEntriesAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashEntriesAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
