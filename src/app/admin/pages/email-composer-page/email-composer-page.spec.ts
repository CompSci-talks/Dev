import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailComposerPage } from './email-composer-page';

describe('EmailComposerPage', () => {
  let component: EmailComposerPage;
  let fixture: ComponentFixture<EmailComposerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailComposerPage],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailComposerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
