/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAssetsMainPageComponent } from './fixed-assets-main-page.component';

describe('FixedAssetsMainPageComponent', () => {
  let component: FixedAssetsMainPageComponent;
  let fixture: ComponentFixture<FixedAssetsMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FixedAssetsMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedAssetsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
