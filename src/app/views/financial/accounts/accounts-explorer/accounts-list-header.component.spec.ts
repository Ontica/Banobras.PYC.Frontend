/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAccountListHeaderComponent } from './accounts-list-header.component';

describe('FinancialAccountListHeaderComponent', () => {
  let component: FinancialAccountListHeaderComponent;
  let fixture: ComponentFixture<FinancialAccountListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialAccountListHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialAccountListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
