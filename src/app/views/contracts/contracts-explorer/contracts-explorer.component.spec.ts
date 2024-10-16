/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsExplorerComponent } from './contracts-explorer.component';

describe('ContractsExplorerComponent', () => {
  let component: ContractsExplorerComponent;
  let fixture: ComponentFixture<ContractsExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractsExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractsExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
