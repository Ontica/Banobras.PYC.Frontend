/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountabilitiesControlsComponent } from './accountabilities-controls.component';

describe('AccountabilitiesControlsComponent', () => {
  let component: AccountabilitiesControlsComponent;
  let fixture: ComponentFixture<AccountabilitiesControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountabilitiesControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountabilitiesControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
