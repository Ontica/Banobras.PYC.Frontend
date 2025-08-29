/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAccountOperationsTypesEditionComponent } from './operations-types-edition.component';

describe('FinancialAccountOperationsTypesEditionComponent', () => {
  let component: FinancialAccountOperationsTypesEditionComponent;
  let fixture: ComponentFixture<FinancialAccountOperationsTypesEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialAccountOperationsTypesEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialAccountOperationsTypesEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
