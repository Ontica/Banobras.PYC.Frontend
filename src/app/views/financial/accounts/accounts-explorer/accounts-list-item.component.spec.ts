/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAccountListItemComponent } from './accounts-list-item.component';

describe('FinancialAccountListItemComponent', () => {
  let component: FinancialAccountListItemComponent;
  let fixture: ComponentFixture<FinancialAccountListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialAccountListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialAccountListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
