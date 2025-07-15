/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsTransactionEntriesEditionComponent } from './transaction-entries-edition.component';

describe('AssetsTransactionEntriesEditionComponent', () => {
  let component: AssetsTransactionEntriesEditionComponent;
  let fixture: ComponentFixture<AssetsTransactionEntriesEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsTransactionEntriesEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsTransactionEntriesEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
