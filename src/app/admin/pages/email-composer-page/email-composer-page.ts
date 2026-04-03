import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { QuillModule } from 'ngx-quill';
// No lucide-angular import
import { EmailSelectionService } from '../../services/email-selection.service';
import { ToastService } from '../../../core/services/toast.service';
import { EMAIL_SERVICE } from '../../services/email.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-email-composer-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule],
  templateUrl: './email-composer-page.html',
})
export class EmailComposerPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private emailSelection = inject(EmailSelectionService);
  private toastService = inject(ToastService);
  private emailService = inject(EMAIL_SERVICE);

  emailForm!: FormGroup;
  selectedRecipients: User[] = [];
  isSending = false;

  ngOnInit() {
    this.selectedRecipients = this.emailSelection.getSelectedUsers();

    // Redirect back if no users are selected
    if (this.selectedRecipients.length === 0) {
      this.toastService.error('No users selected for emailing.');
      this.goBack();
      return;
    }

    this.emailForm = this.fb.group({
      subject: ['', [Validators.required, Validators.minLength(3)]],
      body: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  removeRecipient(uid: string) {
    this.emailSelection.removeSelectedUser(uid);
    this.selectedRecipients = this.emailSelection.getSelectedUsers();

    if (this.selectedRecipients.length === 0) {
      this.goBack();
    }
  }

  async sendEmail() {
    if (this.emailForm.invalid || this.selectedRecipients.length === 0) {
      return;
    }

    this.isSending = true;
    const { subject, body } = this.emailForm.value;

    try {
      const payload = {
        to: this.selectedRecipients.map(u => u.email),
        subject: subject,
        body: body
      };

      await firstValueFrom(this.emailService.send(payload));

      this.toastService.success(`Email sent to ${this.selectedRecipients.length} recipients`);
      this.emailSelection.clearSelection();
      this.goBack();
    } catch (error: any) {
      console.error('Error sending email:', error);
      this.toastService.error(error.message || 'Failed to send email. Please check your configuration.');
    } finally {
      this.isSending = false;
    }
  }


  goBack() {
    this.router.navigate(['/admin/user-management']);
  }
}
