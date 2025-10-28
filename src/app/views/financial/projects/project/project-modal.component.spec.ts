/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialProjectModalComponent } from './project-modal.component';

describe('FinancialProjectModalComponent', () => {
  let component: FinancialProjectModalComponent;
  let fixture: ComponentFixture<FinancialProjectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialProjectModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialProjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
