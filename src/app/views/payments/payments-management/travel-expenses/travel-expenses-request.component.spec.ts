/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelExpensesRequestComponent } from './travel-expenses-request.component';

describe('TravelExpensesRequestComponent', () => {
  let component: TravelExpensesRequestComponent;
  let fixture: ComponentFixture<TravelExpensesRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TravelExpensesRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelExpensesRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
