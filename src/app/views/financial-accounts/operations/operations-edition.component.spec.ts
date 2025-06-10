/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsEditionComponent } from './operations-edition.component';

describe('OperationsEditionComponent', () => {
  let component: OperationsEditionComponent;
  let fixture: ComponentFixture<OperationsEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationsEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationsEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
