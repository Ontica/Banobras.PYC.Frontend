/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestHeaderComponent } from './request-header.component';

describe('RequestHeaderComponent', () => {
  let component: RequestHeaderComponent;
  let fixture: ComponentFixture<RequestHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
