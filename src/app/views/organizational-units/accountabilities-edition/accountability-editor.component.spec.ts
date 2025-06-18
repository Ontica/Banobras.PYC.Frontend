/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountabilityEditorComponent } from './accountability-editor.component';

describe('AccountabilityEditorComponent', () => {
  let component: AccountabilityEditorComponent;
  let fixture: ComponentFixture<AccountabilityEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountabilityEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountabilityEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
