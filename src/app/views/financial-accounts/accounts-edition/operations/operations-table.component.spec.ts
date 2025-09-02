/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAccountOperationsTableComponent } from './operations-table.component';

describe('FinancialAccountOperationsTableComponent', () => {
  let component: FinancialAccountOperationsTableComponent;
  let fixture: ComponentFixture<FinancialAccountOperationsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialAccountOperationsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialAccountOperationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
