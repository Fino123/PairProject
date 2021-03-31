import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStarComponent } from './user-star.component';

describe('UserStarComponent', () => {
  let component: UserStarComponent;
  let fixture: ComponentFixture<UserStarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserStarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
