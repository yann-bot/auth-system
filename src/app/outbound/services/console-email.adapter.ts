import type { EmailMessage, EmailSender } from "../../core/application/ports/email.sender";

export class ConsoleEmailSender implements EmailSender {
  async send(message: EmailMessage): Promise<void> {
    console.log("[email] →", message.to);
    console.log("  subject:", message.subject);
    console.log("  html:", message.html);
    if (message.text) console.log("  text:", message.text);
  }
}

export const emailSender: EmailSender = new ConsoleEmailSender();
