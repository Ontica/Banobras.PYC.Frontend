/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAssetsFilterComponent } from './fixed-assets-filter.component';

describe('FixedAssetsFilterComponent', () => {
  let component: FixedAssetsFilterComponent;
  let fixture: ComponentFixture<FixedAssetsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FixedAssetsFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedAssetsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
