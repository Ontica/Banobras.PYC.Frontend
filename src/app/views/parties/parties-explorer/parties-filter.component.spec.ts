/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartiesFilterComponent } from './parties-filter.component';

describe('PartiesFilterComponent', () => {
  let component: PartiesFilterComponent;
  let fixture: ComponentFixture<PartiesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartiesFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartiesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
