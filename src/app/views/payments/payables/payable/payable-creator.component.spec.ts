/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayableCreatorComponent } from './payable-creator.component';

describe('PayableCreatorComponent', () => {
  let component: PayableCreatorComponent;
  let fixture: ComponentFixture<PayableCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayableCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayableCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
