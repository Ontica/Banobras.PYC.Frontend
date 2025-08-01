/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationAssignerComponent } from './operation-assigner.component';

describe('OperationAssignerComponent', () => {
  let component: OperationAssignerComponent;
  let fixture: ComponentFixture<OperationAssignerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationAssignerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationAssignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
