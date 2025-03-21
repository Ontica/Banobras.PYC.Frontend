/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTabbedViewComponent } from './asset-tabbed-view.component';

describe('AssetTabbedViewComponent', () => {
  let component: AssetTabbedViewComponent;
  let fixture: ComponentFixture<AssetTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
