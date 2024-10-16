/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsMainPageComponent } from './contracts-main-page.component';

describe('ContractsMainPageComponent', () => {
  let component: ContractsMainPageComponent;
  let fixture: ComponentFixture<ContractsMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractsMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
