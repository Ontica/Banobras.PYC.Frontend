/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillEditorComponent } from './bill-editor.component';

describe('BillEditorComponent', () => {
  let component: BillEditorComponent;
  let fixture: ComponentFixture<BillEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
