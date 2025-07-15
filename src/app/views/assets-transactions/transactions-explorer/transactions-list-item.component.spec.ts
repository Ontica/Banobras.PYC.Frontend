/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsTransactionsListItemComponent } from './transactions-list-item.component';

describe('AssetsTransactionsListItemComponent', () => {
  let component: AssetsTransactionsListItemComponent;
  let fixture: ComponentFixture<AssetsTransactionsListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsTransactionsListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsTransactionsListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
