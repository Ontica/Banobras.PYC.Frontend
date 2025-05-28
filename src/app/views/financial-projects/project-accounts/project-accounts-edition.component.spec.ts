/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialProjectAccountsEditionComponent } from './project-accounts-edition.component';

describe('FinancialProjectAccountsEditionComponent', () => {
  let component: FinancialProjectAccountsEditionComponent;
  let fixture: ComponentFixture<FinancialProjectAccountsEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialProjectAccountsEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialProjectAccountsEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
