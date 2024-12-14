/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBudgetSegmentsTableComponent } from './product-budget-segments-table.component';

describe('ProductBudgetSegmentsTableComponent', () => {
  let component: ProductBudgetSegmentsTableComponent;
  let fixture: ComponentFixture<ProductBudgetSegmentsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductBudgetSegmentsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductBudgetSegmentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
