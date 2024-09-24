/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTasksEditionComponent } from './request-tasks-edition.component';

describe('RequestTasksEditionComponent', () => {
  let component: RequestTasksEditionComponent;
  let fixture: ComponentFixture<RequestTasksEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestTasksEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestTasksEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
