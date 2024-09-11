/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsOrdersMainPageComponent } from './payments-orders-main-page.component';

describe('PaymentsOrdersMainPageComponent', () => {
  let component: PaymentsOrdersMainPageComponent;
  let fixture: ComponentFixture<PaymentsOrdersMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentsOrdersMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsOrdersMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
