/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditAccountAttributesComponent } from './credit-account-attributes.component';


describe('CreditAccountAttributesComponent', () => {
  let component: CreditAccountAttributesComponent;
  let fixture: ComponentFixture<CreditAccountAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditAccountAttributesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditAccountAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
