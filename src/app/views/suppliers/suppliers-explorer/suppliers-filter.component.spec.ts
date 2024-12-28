/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersFilterComponent } from './suppliers-filter.component';

describe('SuppliersFilterComponent', () => {
  let component: SuppliersFilterComponent;
  let fixture: ComponentFixture<SuppliersFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuppliersFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuppliersFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
