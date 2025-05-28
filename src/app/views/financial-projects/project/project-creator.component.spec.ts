/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialProjectCreatorComponent } from './project-creator.component';

describe('FinancialProjectCreatorComponent', () => {
  let component: FinancialProjectCreatorComponent;
  let fixture: ComponentFixture<FinancialProjectCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialProjectCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialProjectCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
