/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAssetTabbedViewComponent } from './fixed-asset-tabbed-view.component';

describe('FixedAssetTabbedViewComponent', () => {
  let component: FixedAssetTabbedViewComponent;
  let fixture: ComponentFixture<FixedAssetTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FixedAssetTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedAssetTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
