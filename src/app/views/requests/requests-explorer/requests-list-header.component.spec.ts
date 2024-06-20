import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsListHeaderComponent } from './requests-list-header.component';

describe('RequestsListHeaderComponent', () => {
  let component: RequestsListHeaderComponent;
  let fixture: ComponentFixture<RequestsListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestsListHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestsListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
