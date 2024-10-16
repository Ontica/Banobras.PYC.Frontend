/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsListItemComponent } from './contracts-list-item.component';

describe('ContractsListItemComponent', () => {
  let component: ContractsListItemComponent;
  let fixture: ComponentFixture<ContractsListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractsListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractsListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
