/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsAssignmentEntriesTableComponent } from './assignment-entries-table.component';

describe('AssetsAssignmentEntriesTableComponent', () => {
  let component: AssetsAssignmentEntriesTableComponent;
  let fixture: ComponentFixture<AssetsAssignmentEntriesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsAssignmentEntriesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsAssignmentEntriesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
