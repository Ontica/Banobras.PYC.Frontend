/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillConceptsTableComponent } from './bill-concepts-table.component';

describe('BillConceptsTableComponent', () => {
  let component: BillConceptsTableComponent;
  let fixture: ComponentFixture<BillConceptsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillConceptsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillConceptsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
