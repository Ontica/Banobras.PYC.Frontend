/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsExplorerComponent } from './transactions-explorer.component';

describe('TransactionsExplorerComponent', () => {
  let component: TransactionsExplorerComponent;
  let fixture: ComponentFixture<TransactionsExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionsExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionsExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
