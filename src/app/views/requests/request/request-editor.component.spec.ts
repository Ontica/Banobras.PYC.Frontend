/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestEditorComponent } from './request-editor.component';

describe('RequestEditorComponent', () => {
  let component: RequestEditorComponent;
  let fixture: ComponentFixture<RequestEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
