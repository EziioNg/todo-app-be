import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailsService {
  private resend: Resend;
  private sender: string | undefined;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    // console.log('api key: ', apiKey);
    this.sender = this.configService.get<string>('RESEND_ADMIN_SENDER_EMAIL');

    this.resend = new Resend(apiKey);
  }

  async sendAdminVerification(
    email: string,
    username: string,
    firstLoginUrl: string,
  ) {
    const templatePath = join(
      process.cwd(),
      'src/modules/mails/templates/TodosVerifyEmail.html',
    );
    // const templatePath = join(__dirname, 'templates/TodosVerifyEmail.html');

    let html = readFileSync(templatePath, 'utf8');

    // replace variables
    html = html
      .replace('{admin_name}', username)
      .replace('{VERIFICATION_LINK}', firstLoginUrl);

    await this.resend.emails.send({
      from: this.sender!,
      to: email,
      subject: 'Your employee account credentials',
      html,
    });
  }

  async sendEmployeeCredentials(
    email: string,
    username: string,
    firstLoginUrl: string,
  ) {
    const templatePath = join(
      process.cwd(),
      'src/modules/mails/templates/TodosAccountEmail.html',
    );
    // const templatePath = join(__dirname, 'templates/TodosAccountEmail.html');

    let html = readFileSync(templatePath, 'utf8');

    // replace variables
    html = html
      .replace('{employee_name}', username)
      .replace('{employee_email}', email)
      .replace('{VERIFICATION_LINK}', firstLoginUrl);

    await this.resend.emails.send({
      from: this.sender!,
      to: email,
      subject: 'Your employee account credentials',
      html,
    });
  }
}
