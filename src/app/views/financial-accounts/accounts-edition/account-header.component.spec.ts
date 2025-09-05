/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAccountHeaderComponent } from './account-header.component';

describe('FinancialAccountHeaderComponent', () => {
  let component: FinancialAccountHeaderComponent;
  let fixture: ComponentFixture<FinancialAccountHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialAccountHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialAccountHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
