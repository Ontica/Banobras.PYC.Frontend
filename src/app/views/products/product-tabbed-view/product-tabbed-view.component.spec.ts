/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTabbedViewComponent } from './product-tabbed-view.component';

describe('ProductTabbedViewComponent', () => {
  let component: ProductTabbedViewComponent;
  let fixture: ComponentFixture<ProductTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
