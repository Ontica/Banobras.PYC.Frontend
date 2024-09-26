/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestStepsListControlsComponent } from './request-steps-list-controls.component';

describe('RequestStepsListControlsComponent', () => {
  let component: RequestStepsListControlsComponent;
  let fixture: ComponentFixture<RequestStepsListControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestStepsListControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestStepsListControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
