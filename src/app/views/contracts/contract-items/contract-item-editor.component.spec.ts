/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractItemEditorComponent } from './contract-item-editor.component';

describe('ContractItemEditorComponent', () => {
  let component: ContractItemEditorComponent;
  let fixture: ComponentFixture<ContractItemEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractItemEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractItemEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
