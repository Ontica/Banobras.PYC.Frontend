/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsTableComponent } from './bills-table.component';

describe('BillsTableComponent', () => {
  let component: BillsTableComponent;
  let fixture: ComponentFixture<BillsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
