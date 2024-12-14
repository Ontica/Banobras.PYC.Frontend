/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBudgetSegmentEditorComponent } from './product-budget-segment-editor.component';

describe('ProductBudgetSegmentEditorComponent', () => {
  let component: ProductBudgetSegmentEditorComponent;
  let fixture: ComponentFixture<ProductBudgetSegmentEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductBudgetSegmentEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductBudgetSegmentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
