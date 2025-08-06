/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordSearchFilterComponent } from './record-search-filter.component';


describe('RecordSearchFilterComponent', () => {
  let component: RecordSearchFilterComponent;
  let fixture: ComponentFixture<RecordSearchFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordSearchFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordSearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
