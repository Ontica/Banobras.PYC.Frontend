/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsAssignmentTableComponent } from './assignments-table.component';

describe('AssetsAssignmentTableComponent', () => {
  let component: AssetsAssignmentTableComponent;
  let fixture: ComponentFixture<AssetsAssignmentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsAssignmentTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsAssignmentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
