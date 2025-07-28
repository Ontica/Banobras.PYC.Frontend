/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetMainPageComponent } from './budget-main-page.component';

describe('BudgetMainPageComponent', () => {
  let component: BudgetMainPageComponent;
  let fixture: ComponentFixture<BudgetMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
