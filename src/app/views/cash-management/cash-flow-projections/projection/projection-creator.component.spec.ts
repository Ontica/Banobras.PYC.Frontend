/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowProjectionCreatorComponent } from './projection-creator.component';

describe('CashFlowProjectionCreatorComponent', () => {
  let component: CashFlowProjectionCreatorComponent;
  let fixture: ComponentFixture<CashFlowProjectionCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashFlowProjectionCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowProjectionCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
