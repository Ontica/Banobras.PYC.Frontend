/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetSegmentItemSelectorComponent } from './budget-segment-item-selector.component';

describe('BudgetSegmentItemSelectorComponent', () => {
  let component: BudgetSegmentItemSelectorComponent;
  let fixture: ComponentFixture<BudgetSegmentItemSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetSegmentItemSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetSegmentItemSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
