/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayableEditorComponent } from './payable-editor.component';

describe('PayableEditorComponent', () => {
  let component: PayableEditorComponent;
  let fixture: ComponentFixture<PayableEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayableEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayableEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
