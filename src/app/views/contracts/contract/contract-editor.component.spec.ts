/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractEditorComponent } from './contract-editor.component';

describe('ContractEditorComponent', () => {
  let component: ContractEditorComponent;
  let fixture: ComponentFixture<ContractEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
