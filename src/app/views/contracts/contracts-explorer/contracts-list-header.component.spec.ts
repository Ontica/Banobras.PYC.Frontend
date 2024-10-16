/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsListHeaderComponent } from './contracts-list-header.component';

describe('ContractsListHeaderComponent', () => {
  let component: ContractsListHeaderComponent;
  let fixture: ComponentFixture<ContractsListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractsListHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractsListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
