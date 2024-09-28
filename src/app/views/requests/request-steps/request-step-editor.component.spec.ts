/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestStepEditorComponent } from './request-step-editor.component';

describe('RequestStepEditorComponent', () => {
  let component: RequestStepEditorComponent;
  let fixture: ComponentFixture<RequestStepEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestStepEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestStepEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
