/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashEntriesTableComponent } from './entries-table.component';

describe('CashEntriesTableComponent', () => {
  let component: CashEntriesTableComponent;
  let fixture: ComponentFixture<CashEntriesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashEntriesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashEntriesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
