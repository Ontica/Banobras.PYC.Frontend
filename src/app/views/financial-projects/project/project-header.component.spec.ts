/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialProjectHeaderComponent } from './project-header.component';

describe('FinancialProjectHeaderComponent', () => {
  let component: FinancialProjectHeaderComponent;
  let fixture: ComponentFixture<FinancialProjectHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialProjectHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialProjectHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
