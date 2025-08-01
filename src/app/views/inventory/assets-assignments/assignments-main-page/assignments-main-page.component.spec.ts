/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsAssignmentsMainPageComponent } from './assignments-main-page.component';

describe('AssetsAssignmentsMainPageComponent', () => {
  let component: AssetsAssignmentsMainPageComponent;
  let fixture: ComponentFixture<AssetsAssignmentsMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsAssignmentsMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsAssignmentsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
