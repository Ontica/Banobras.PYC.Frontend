/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionsFilterComponent } from './provisions-filter.component';

describe('ProvisionsFilterComponent', () => {
  let component: ProvisionsFilterComponent;
  let fixture: ComponentFixture<ProvisionsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProvisionsFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvisionsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
