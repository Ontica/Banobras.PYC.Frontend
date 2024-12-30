/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractOrdersTableComponent } from './contract-orders-table.component';

describe('ContractOrdersTableComponent', () => {
  let component: ContractOrdersTableComponent;
  let fixture: ComponentFixture<ContractOrdersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractOrdersTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractOrdersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
