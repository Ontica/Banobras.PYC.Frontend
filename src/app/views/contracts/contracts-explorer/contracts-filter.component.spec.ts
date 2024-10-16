/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsFilterComponent } from './contracts-filter.component';

describe('ContractsFilterComponent', () => {
  let component: ContractsFilterComponent;
  let fixture: ComponentFixture<ContractsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractsFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
