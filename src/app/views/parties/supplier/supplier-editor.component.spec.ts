/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierEditorComponent } from './supplier-editor.component';

describe('SupplierEditorComponent', () => {
  let component: SupplierEditorComponent;
  let fixture: ComponentFixture<SupplierEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupplierEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
