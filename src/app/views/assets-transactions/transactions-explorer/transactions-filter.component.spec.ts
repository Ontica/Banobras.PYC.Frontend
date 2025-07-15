/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsTransactionsFilterComponent } from './transactions-filter.component';

describe('AssetsTransactionsFilterComponent', () => {
  let component: AssetsTransactionsFilterComponent;
  let fixture: ComponentFixture<AssetsTransactionsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsTransactionsFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsTransactionsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
