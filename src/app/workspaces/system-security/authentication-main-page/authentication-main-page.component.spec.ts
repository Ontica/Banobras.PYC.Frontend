/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationMainPageComponent } from './authentication-main-page.component';

describe('AuthenticationMainPageComponent', () => {
  let component: AuthenticationMainPageComponent;
  let fixture: ComponentFixture<AuthenticationMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthenticationMainPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthenticationMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
