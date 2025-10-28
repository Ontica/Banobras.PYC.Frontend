/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAccountModalComponent } from './account-modal.component';

describe('FinancialAccountModalComponent', () => {
  let component: FinancialAccountModalComponent;
  let fixture: ComponentFixture<FinancialAccountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialAccountModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
