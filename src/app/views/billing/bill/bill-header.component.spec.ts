/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillHeaderComponent } from './bill-header.component';

describe('BillHeaderComponent', () => {
  let component: BillHeaderComponent;
  let fixture: ComponentFixture<BillHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
