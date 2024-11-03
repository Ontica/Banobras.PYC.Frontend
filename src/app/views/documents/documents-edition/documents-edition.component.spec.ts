/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsEditionComponent } from './documents-edition.component';

describe('DocumentsEditionComponent', () => {
  let component: DocumentsEditionComponent;
  let fixture: ComponentFixture<DocumentsEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentsEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
