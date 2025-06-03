/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialProjectAccountOperationsEditionComponent } from './account-operations-edition.component';

describe('FinancialProjectAccountOperationsEditionComponent', () => {
  let component: FinancialProjectAccountOperationsEditionComponent;
  let fixture: ComponentFixture<FinancialProjectAccountOperationsEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialProjectAccountOperationsEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialProjectAccountOperationsEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
