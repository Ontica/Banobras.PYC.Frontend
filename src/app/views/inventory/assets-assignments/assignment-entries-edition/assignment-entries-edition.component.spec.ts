/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsAssignmentEntriesEditionComponent } from './assignment-entries-edition.component';

describe('AssetsAssignmentEntriesEditionComponent', () => {
  let component: AssetsAssignmentEntriesEditionComponent;
  let fixture: ComponentFixture<AssetsAssignmentEntriesEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsAssignmentEntriesEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsAssignmentEntriesEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
