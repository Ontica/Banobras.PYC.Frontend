/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSubmitModalComponent } from './confirm-submit-modal.component';

describe('ConfirmSubmitModalComponent', () => {
  let component: ConfirmSubmitModalComponent;
  let fixture: ComponentFixture<ConfirmSubmitModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmSubmitModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmSubmitModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
