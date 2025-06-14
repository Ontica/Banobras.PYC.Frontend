/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountabilitiesEditionComponent } from './accountabilities-edition.component';

describe('AccountabilitiesEditionComponent', () => {
  let component: AccountabilitiesEditionComponent;
  let fixture: ComponentFixture<AccountabilitiesEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountabilitiesEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountabilitiesEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
