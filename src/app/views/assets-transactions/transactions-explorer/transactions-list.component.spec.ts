/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsTransactionsListComponent } from './transactions-list.component';

describe('AssetsTransactionsListComponent', () => {
  let component: AssetsTransactionsListComponent;
  let fixture: ComponentFixture<AssetsTransactionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsTransactionsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsTransactionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
