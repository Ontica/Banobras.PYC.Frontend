/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAccountsControlsComponent } from './accounts-controls.component';

describe('FinancialAccountsControlsComponent', () => {
  let component: FinancialAccountsControlsComponent;
  let fixture: ComponentFixture<FinancialAccountsControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialAccountsControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialAccountsControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
