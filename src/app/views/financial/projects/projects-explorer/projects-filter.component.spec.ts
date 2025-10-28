/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialProjectsFilterComponent } from './projects-filter.component';

describe('FinancialProjectsFilterComponent', () => {
  let component: FinancialProjectsFilterComponent;
  let fixture: ComponentFixture<FinancialProjectsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialProjectsFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialProjectsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
