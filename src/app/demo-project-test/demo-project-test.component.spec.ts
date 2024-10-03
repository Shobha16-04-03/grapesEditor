import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoProjectTestComponent } from './demo-project-test.component';

describe('DemoProjectTestComponent', () => {
  let component: DemoProjectTestComponent;
  let fixture: ComponentFixture<DemoProjectTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoProjectTestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemoProjectTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
