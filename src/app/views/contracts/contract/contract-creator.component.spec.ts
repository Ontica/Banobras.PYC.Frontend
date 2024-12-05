/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractCreatorComponent } from './contract-creator.component';

describe('ContractCreatorComponent', () => {
  let component: ContractCreatorComponent;
  let fixture: ComponentFixture<ContractCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
