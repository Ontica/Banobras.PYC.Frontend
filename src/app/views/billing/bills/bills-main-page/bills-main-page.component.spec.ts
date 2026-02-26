/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsMainPageComponent } from './bills-main-page.component';

describe('BillsMainPageComponent', () => {
  let component: BillsMainPageComponent;
  let fixture: ComponentFixture<BillsMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillsMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
