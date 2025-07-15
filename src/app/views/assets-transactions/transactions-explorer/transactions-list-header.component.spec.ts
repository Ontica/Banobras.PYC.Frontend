/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsTransactionsListHeaderComponent } from './transactions-list-header.component';

describe('AssetsTransactionsListHeaderComponent', () => {
  let component: AssetsTransactionsListHeaderComponent;
  let fixture: ComponentFixture<AssetsTransactionsListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsTransactionsListHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsTransactionsListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
