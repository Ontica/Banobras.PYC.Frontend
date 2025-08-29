/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAccountOperationsTypesTableComponent } from './operations-types-table.component';

describe('FinancialAccountOperationsTypesTableComponent', () => {
  let component: FinancialAccountOperationsTypesTableComponent;
  let fixture: ComponentFixture<FinancialAccountOperationsTypesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialAccountOperationsTypesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialAccountOperationsTypesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
