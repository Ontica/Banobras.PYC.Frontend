/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierCreatorComponent } from './supplier-creator.component';

describe('SupplierCreatorComponent', () => {
  let component: SupplierCreatorComponent;
  let fixture: ComponentFixture<SupplierCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupplierCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
