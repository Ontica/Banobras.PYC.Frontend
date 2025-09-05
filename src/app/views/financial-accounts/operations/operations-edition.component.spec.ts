/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAccountOperationsEditionComponent } from './operations-edition.component';

describe('FinancialAccountOperationsEditionComponent', () => {
  let component: FinancialAccountOperationsEditionComponent;
  let fixture: ComponentFixture<FinancialAccountOperationsEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialAccountOperationsEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialAccountOperationsEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
