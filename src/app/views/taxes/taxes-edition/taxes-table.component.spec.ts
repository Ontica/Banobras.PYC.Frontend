/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxesTableComponent } from './taxes-table.component';

describe('TaxesTableComponent', () => {
  let component: TaxesTableComponent;
  let fixture: ComponentFixture<TaxesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaxesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
