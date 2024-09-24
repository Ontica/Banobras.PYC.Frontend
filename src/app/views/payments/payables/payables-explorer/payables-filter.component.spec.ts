/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayablesFilterComponent } from './payables-filter.component';

describe('PayablesFilterComponent', () => {
  let component: PayablesFilterComponent;
  let fixture: ComponentFixture<PayablesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayablesFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayablesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
