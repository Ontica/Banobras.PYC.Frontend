/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestStepsEditionComponent } from './request-steps-edition.component';

describe('RequestStepsEditionComponent', () => {
  let component: RequestStepsEditionComponent;
  let fixture: ComponentFixture<RequestStepsEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestStepsEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestStepsEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
