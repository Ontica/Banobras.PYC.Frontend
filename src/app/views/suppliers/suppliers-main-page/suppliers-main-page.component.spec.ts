/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersMainPageComponent } from './suppliers-main-page.component';

describe('SuppliersMainPageComponent', () => {
  let component: SuppliersMainPageComponent;
  let fixture: ComponentFixture<SuppliersMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuppliersMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuppliersMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
