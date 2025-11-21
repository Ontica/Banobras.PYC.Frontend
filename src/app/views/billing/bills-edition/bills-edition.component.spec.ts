/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsEditionComponent } from './bills-edition.component';

describe('BillsEditionComponent', () => {
  let component: BillsEditionComponent;
  let fixture: ComponentFixture<BillsEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillsEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillsEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
