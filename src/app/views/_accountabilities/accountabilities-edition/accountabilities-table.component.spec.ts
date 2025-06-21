/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountabilitiesTableComponent } from './accountabilities-table.component';

describe('AccountabilitiesTableComponent', () => {
  let component: AccountabilitiesTableComponent;
  let fixture: ComponentFixture<AccountabilitiesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountabilitiesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountabilitiesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
