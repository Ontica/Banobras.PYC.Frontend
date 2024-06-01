import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsExplorerComponent } from './requests-explorer.component';

describe('RequestsExplorerComponent', () => {
  let component: RequestsExplorerComponent;
  let fixture: ComponentFixture<RequestsExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestsExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestsExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
