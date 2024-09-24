/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTasksListComponent } from './request-tasks-list.component';

describe('RequestTasksListComponent', () => {
  let component: RequestTasksListComponent;
  let fixture: ComponentFixture<RequestTasksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestTasksListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestTasksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
