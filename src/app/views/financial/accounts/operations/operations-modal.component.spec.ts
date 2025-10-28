/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAccountOperationsModalComponent } from './operations-modal.component';

describe('FinancialAccountOperationsModalComponent', () => {
  let component: FinancialAccountOperationsModalComponent;
  let fixture: ComponentFixture<FinancialAccountOperationsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialAccountOperationsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialAccountOperationsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
