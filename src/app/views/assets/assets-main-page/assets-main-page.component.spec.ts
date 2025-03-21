/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsMainPageComponent } from './assets-main-page.component';

describe('AssetsMainPageComponent', () => {
  let component: AssetsMainPageComponent;
  let fixture: ComponentFixture<AssetsMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
