/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayableHeaderComponent } from './payable-header.component';

describe('PayableHeaderComponent', () => {
  let component: PayableHeaderComponent;
  let fixture: ComponentFixture<PayableHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayableHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayableHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
