/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsAssignmentsExplorerComponent } from './assignments-explorer.component';

describe('AssetsAssignmentsExplorerComponent', () => {
  let component: AssetsAssignmentsExplorerComponent;
  let fixture: ComponentFixture<AssetsAssignmentsExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsAssignmentsExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsAssignmentsExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
