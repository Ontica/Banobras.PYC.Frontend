/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollsTableComponent } from './payrolls-table.component';

describe('PayrollsTableComponent', () => {
  let component: PayrollsTableComponent;
  let fixture: ComponentFixture<PayrollsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayrollsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
