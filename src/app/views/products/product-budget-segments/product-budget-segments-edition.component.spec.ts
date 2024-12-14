/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBudgetSegmentsEditionComponent } from './product-budget-segments-edition.component';

describe('ProductBudgetSegmentsEditionComponent', () => {
  let component: ProductBudgetSegmentsEditionComponent;
  let fixture: ComponentFixture<ProductBudgetSegmentsEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductBudgetSegmentsEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductBudgetSegmentsEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
