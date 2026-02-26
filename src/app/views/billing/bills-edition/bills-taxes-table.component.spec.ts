/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsTaxesTableComponent } from './bills-taxes-table.component';

describe('BillsTaxesTableComponent', () => {
  let component: BillsTaxesTableComponent;
  let fixture: ComponentFixture<BillsTaxesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillsTaxesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillsTaxesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
