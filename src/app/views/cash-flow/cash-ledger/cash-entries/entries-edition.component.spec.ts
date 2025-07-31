/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashEntriesEditionComponent } from './entries-edition.component';

describe('CashEntriesEditionComponent', () => {
  let component: CashEntriesEditionComponent;
  let fixture: ComponentFixture<CashEntriesEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashEntriesEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashEntriesEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
