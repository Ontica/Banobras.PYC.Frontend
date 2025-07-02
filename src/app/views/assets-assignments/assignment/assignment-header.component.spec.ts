/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsAssignmentHeaderComponent } from './assignment-header.component';

describe('AssetsAssignmentHeaderComponent', () => {
  let component: AssetsAssignmentHeaderComponent;
  let fixture: ComponentFixture<AssetsAssignmentHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsAssignmentHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsAssignmentHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
