/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialProjectAccountOperationAssignerComponent } from './account-operation-assigner.component';

describe('FinancialProjectAccountOperationAssignerComponent', () => {
  let component: FinancialProjectAccountOperationAssignerComponent;
  let fixture: ComponentFixture<FinancialProjectAccountOperationAssignerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialProjectAccountOperationAssignerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialProjectAccountOperationAssignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
