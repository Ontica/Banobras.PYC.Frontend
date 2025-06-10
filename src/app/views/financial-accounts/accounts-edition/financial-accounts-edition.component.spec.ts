/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAccountsEditionComponent } from './financial-accounts-edition.component';

describe('FinancialAccountsEditionComponent', () => {
  let component: FinancialAccountsEditionComponent;
  let fixture: ComponentFixture<FinancialAccountsEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialAccountsEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialAccountsEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
