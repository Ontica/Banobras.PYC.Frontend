/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestStepsListItemComponent } from './request-steps-list-item.component';

describe('RequestStepsListItemComponent', () => {
  let component: RequestStepsListItemComponent;
  let fixture: ComponentFixture<RequestStepsListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestStepsListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestStepsListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
