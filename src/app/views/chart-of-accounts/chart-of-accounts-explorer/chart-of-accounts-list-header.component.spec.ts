/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartOfAccountsListHeaderComponent } from './chart-of-accounts-list-header.component';

describe('ChartOfAccountsListHeaderComponent', () => {
  let component: ChartOfAccountsListHeaderComponent;
  let fixture: ComponentFixture<ChartOfAccountsListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartOfAccountsListHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartOfAccountsListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
