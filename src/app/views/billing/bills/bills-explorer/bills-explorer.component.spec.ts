/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsExplorerComponent } from './bills-explorer.component';

describe('BillsExplorerComponent', () => {
  let component: BillsExplorerComponent;
  let fixture: ComponentFixture<BillsExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillsExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillsExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
