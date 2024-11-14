/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAssetHeaderComponent } from './fixed-asset-header.component';

describe('FixedAssetHeaderComponent', () => {
  let component: FixedAssetHeaderComponent;
  let fixture: ComponentFixture<FixedAssetHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FixedAssetHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedAssetHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
