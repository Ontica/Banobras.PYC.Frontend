/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsAssignmentsFilterComponent } from './assignments-filter.component';

describe('AssetsAssignmentsFilterComponent', () => {
  let component: AssetsAssignmentsFilterComponent;
  let fixture: ComponentFixture<AssetsAssignmentsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsAssignmentsFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsAssignmentsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
