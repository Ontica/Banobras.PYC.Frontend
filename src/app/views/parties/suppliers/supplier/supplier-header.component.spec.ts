/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierHeaderComponent } from './supplier-header.component';

describe('SupplierHeaderComponent', () => {
  let component: SupplierHeaderComponent;
  let fixture: ComponentFixture<SupplierHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupplierHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
