/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialProjectGoalsComponent } from './project-goals.component';


describe('FinancialProjectGoalsComponent', () => {
  let component: FinancialProjectGoalsComponent;
  let fixture: ComponentFixture<FinancialProjectGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialProjectGoalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialProjectGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
