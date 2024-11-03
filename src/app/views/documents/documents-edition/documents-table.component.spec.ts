/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsTableComponent } from './documents-table.component';

describe('DocumentsTableComponent', () => {
  let component: DocumentsTableComponent;
  let fixture: ComponentFixture<DocumentsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
