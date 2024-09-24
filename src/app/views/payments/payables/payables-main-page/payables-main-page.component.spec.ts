/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayablesMainPageComponent } from './payables-main-page.component';

describe('PayablesMainPageComponent', () => {
  let component: PayablesMainPageComponent;
  let fixture: ComponentFixture<PayablesMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayablesMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayablesMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
