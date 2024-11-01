/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractMilestonesTableComponent } from './contract-milestones-table.component';

describe('ContractMilestonesTableComponent', () => {
  let component: ContractMilestonesTableComponent;
  let fixture: ComponentFixture<ContractMilestonesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractMilestonesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractMilestonesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
