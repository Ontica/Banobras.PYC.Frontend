/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestStepsListComponent } from './request-steps-list.component';

describe('RequestStepsListComponent', () => {
  let component: RequestStepsListComponent;
  let fixture: ComponentFixture<RequestStepsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestStepsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestStepsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
