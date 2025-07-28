/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsTransactionsExplorerComponent } from './transactions-explorer.component';

describe('AssetsTransactionsExplorerComponent', () => {
  let component: AssetsTransactionsExplorerComponent;
  let fixture: ComponentFixture<AssetsTransactionsExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsTransactionsExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsTransactionsExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
