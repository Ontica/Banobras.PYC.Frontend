/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordSearchListComponent } from './record-search-list.component';

describe('RecordSearchListComponent', () => {
  let component: RecordSearchListComponent;
  let fixture: ComponentFixture<RecordSearchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordSearchListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
