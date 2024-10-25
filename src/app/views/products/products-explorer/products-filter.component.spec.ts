/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsFilterComponent } from './products-filter.component';

describe('ProductsFilterComponent', () => {
  let component: ProductsFilterComponent;
  let fixture: ComponentFixture<ProductsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
