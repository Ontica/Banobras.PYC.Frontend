/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAccountsMainPageComponent } from './accounts-main-page.component';

describe('FinancialAccountsMainPageComponent', () => {
  let component: FinancialAccountsMainPageComponent;
  let fixture: ComponentFixture<FinancialAccountsMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialAccountsMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialAccountsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
