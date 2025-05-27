/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialProjectsMainPageComponent } from './projects-main-page.component';

describe('FinancialProjectsMainPageComponent', () => {
  let component: FinancialProjectsMainPageComponent;
  let fixture: ComponentFixture<FinancialProjectsMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialProjectsMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialProjectsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
