/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionLogTableComponent } from './instruction-log-table.component';

describe('InstructionLogTableComponent', () => {
  let component: InstructionLogTableComponent;
  let fixture: ComponentFixture<InstructionLogTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstructionLogTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructionLogTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
