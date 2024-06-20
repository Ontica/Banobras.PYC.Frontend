/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsListControlsComponent } from './requests-list-controls.component';

describe('RequestsListControlsComponent', () => {
  let component: RequestsListControlsComponent;
  let fixture: ComponentFixture<RequestsListControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestsListControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestsListControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
