/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialProjectsExplorerComponent } from './projects-explorer.component';

describe('FinancialProjectsExplorerComponent', () => {
  let component: FinancialProjectsExplorerComponent;
  let fixture: ComponentFixture<FinancialProjectsExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialProjectsExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialProjectsExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
