import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { getMailerConfig } from 'src/config';
import { ContactUsDto } from './dto/mailer.dto';
import { render } from '@react-email/components';
import { ContactUsTemplate } from './templates/contactUs.template';

@Injectable()
export class MailerService {
  private transporter;

  constructor(private configService: ConfigService) {
    try {
      this.transporter = nodemailer.createTransport(
        getMailerConfig(this.configService),
      );
    } catch (err) {
      console.error('MailerService - ', err);
    }
  }

  async contactUsMail(data: ContactUsDto) {
    const { name, email, message } = data;
    try {
      const html1 = `
        <div>
          <p>Name: ${name}</p>
          <p>Email: ${email}</p>
          <p>Message: ${message}</p>
        </div>
      `;
      const html = await render(ContactUsTemplate({name, email, message}));
      // if (
      //   !process.env.NODE_ENV ||
      //   process.env.NODE_ENV === 'development' ||
      //   process.env.NODE_ENV === 'locale'
      // ) {
      //   console.log(`\n\n *** Send Email *** \n ${html}`);
      //   return;
      // }
      await this.transporter.sendMail({
        from: 'albert.aghajanyan.swe@gmail.com',
        to: [email],
        bcc: [],
        subject: 'Contact Us',
        text: '',
        html: html,
      });
      return { success: true, message: 'Email sent successfully.' };
    } catch (err) {
      console.error('contactUsMail - ', err);
      return { success: false, message: 'Could not send email.' };
    }
  }
}
