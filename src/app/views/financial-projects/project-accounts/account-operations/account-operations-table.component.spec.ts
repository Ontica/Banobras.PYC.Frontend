/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialProjectAccountOperationsTableComponent } from './account-operations-table.component';

describe('FinancialProjectAccountOperationsTableComponent', () => {
  let component: FinancialProjectAccountOperationsTableComponent;
  let fixture: ComponentFixture<FinancialProjectAccountOperationsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialProjectAccountOperationsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialProjectAccountOperationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
