/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractTabbedViewComponent } from './contract-tabbed-view.component';

describe('ContractTabbedViewComponent', () => {
  let component: ContractTabbedViewComponent;
  let fixture: ComponentFixture<ContractTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
