/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAssetsTableComponent } from './fixed-assets-table.component';

describe('FixedAssetsTableComponent', () => {
  let component: FixedAssetsTableComponent;
  let fixture: ComponentFixture<FixedAssetsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FixedAssetsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedAssetsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
