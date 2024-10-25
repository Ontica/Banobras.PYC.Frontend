/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsExplorerComponent } from './products-explorer.component';

describe('ProductsExplorerComponent', () => {
  let component: ProductsExplorerComponent;
  let fixture: ComponentFixture<ProductsExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
