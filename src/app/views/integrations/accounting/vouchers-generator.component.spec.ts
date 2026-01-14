/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VouchersGeneratorComponent } from './vouchers-generator.component';

describe('VouchersGeneratorComponent', () => {
  let component: VouchersGeneratorComponent;
  let fixture: ComponentFixture<VouchersGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VouchersGeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VouchersGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
