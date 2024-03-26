/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectRolesComponent } from './subject-roles.component';

describe('SubjectRolesComponent', () => {
  let component: SubjectRolesComponent;
  let fixture: ComponentFixture<SubjectRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubjectRolesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
