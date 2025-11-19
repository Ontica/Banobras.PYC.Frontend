/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxesEditionComponent } from './taxes-edition.component';

describe('TaxesEditionComponent', () => {
  let component: TaxesEditionComponent;
  let fixture: ComponentFixture<TaxesEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaxesEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxesEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
