/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalCreditSearcherComponent } from './external-credit-searcher.component';

describe('ExternalCreditSearcherComponent', () => {
  let component: ExternalCreditSearcherComponent;
  let fixture: ComponentFixture<ExternalCreditSearcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExternalCreditSearcherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalCreditSearcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
