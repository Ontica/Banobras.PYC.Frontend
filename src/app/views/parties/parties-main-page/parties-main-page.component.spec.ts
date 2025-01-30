/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartiesMainPageComponent } from './parties-main-page.component';

describe('PartiesMainPageComponent', () => {
  let component: PartiesMainPageComponent;
  let fixture: ComponentFixture<PartiesMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartiesMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartiesMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
