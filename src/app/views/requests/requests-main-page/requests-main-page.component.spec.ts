/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsMainPageComponent } from './requests-main-page.component';

describe('RequestsMainPageComponent', () => {
  let component: RequestsMainPageComponent;
  let fixture: ComponentFixture<RequestsMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestsMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
