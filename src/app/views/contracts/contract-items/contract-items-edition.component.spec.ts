/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractItemsEditionComponent } from './contract-items-edition.component';

describe('ContractItemsEditionComponent', () => {
  let component: ContractItemsEditionComponent;
  let fixture: ComponentFixture<ContractItemsEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractItemsEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractItemsEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
