/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsAssignmentsOperationDataComponent } from './assignments-operation-data.component';

describe('AssetsAssignmentsOperationDataComponent', () => {
  let component: AssetsAssignmentsOperationDataComponent;
  let fixture: ComponentFixture<AssetsAssignmentsOperationDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsAssignmentsOperationDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsAssignmentsOperationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
