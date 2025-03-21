/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetEditorComponent } from './asset-editor.component';

describe('AssetEditorComponent', () => {
  let component: AssetEditorComponent;
  let fixture: ComponentFixture<AssetEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
