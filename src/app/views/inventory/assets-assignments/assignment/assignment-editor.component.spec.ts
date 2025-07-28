/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsAssignmentEditorComponent } from './assignment-editor.component';

describe('AssetsAssignmentEditorComponent', () => {
  let component: AssetsAssignmentEditorComponent;
  let fixture: ComponentFixture<AssetsAssignmentEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsAssignmentEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsAssignmentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
