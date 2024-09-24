/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayablesExplorerComponent } from './payables-explorer.component';

describe('PayablesExplorerComponent', () => {
  let component: PayablesExplorerComponent;
  let fixture: ComponentFixture<PayablesExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayablesExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayablesExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
