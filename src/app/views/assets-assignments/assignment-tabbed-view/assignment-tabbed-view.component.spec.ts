/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsAssignmentsAssignmentTabbedViewComponent } from './assignment-tabbed-view.component';

describe('AssetsAssignmentsAssignmentTabbedViewComponent', () => {
  let component: AssetsAssignmentsAssignmentTabbedViewComponent;
  let fixture: ComponentFixture<AssetsAssignmentsAssignmentTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsAssignmentsAssignmentTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsAssignmentsAssignmentTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
