/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTabbedViewComponent } from './request-tabbed-view.component';

describe('RequestTabbedViewComponent', () => {
  let component: RequestTabbedViewComponent;
  let fixture: ComponentFixture<RequestTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
