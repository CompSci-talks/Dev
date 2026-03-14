# Contracts: EmailService

Interface defined per CompSci Talks Constitution Principle III.

```typescript
/**
 * @port EmailService
 * Handles sending emails to seminar attendees in a provider-agnostic way.
 */
export interface EmailService {
  /**
   * Sends a rich-text email to a list of recipients.
   * @param payload The email data including recipients, subject, and HTML body.
   * @returns Observable that completes on success or errors if delivery fails.
   */
  send(payload: EmailPayload): Observable<void>;
}

export interface EmailPayload {
  to: string[];
  subject: string;
  body: string; // HTML
  metadata?: Record<string, any>;
}
```
