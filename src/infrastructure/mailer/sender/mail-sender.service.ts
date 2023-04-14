import { Transporter, createTransport } from "nodemailer";
import { IMailSender, MailOptions } from "../../../application/invoice/email/common/mail-sender.interface";
import { injectable } from "inversify";

@injectable()
export class MailSender implements IMailSender {
    private readonly _transporter: Transporter;

    constructor() {
        this.validateEnvVariables();

        this._transporter = createTransport({
            host: process.env.SMTP_HOST,
            secure: true,
            tls: {
                ciphers: "SSLv3",
            },
            requireTLS: true,
            port: Number(process.env.SMTP_PORT),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendMail(mailOptions: MailOptions): Promise<void> {
        await this._transporter.sendMail(mailOptions);
        console.log(`Email sent to ${mailOptions.to}`);
    }

    private validateEnvVariables(): void {
        if (!process.env.SMTP_HOST) {
            throw new Error("SMPT_HOST must be defined");
        }

        if (!process.env.SMTP_PORT) {
            throw new Error("SMTP_PORT must be defined");
        }

        if (!process.env.SMTP_USER) {
            throw new Error("SMTP_USER must be defined");
        }

        if (!process.env.SMTP_PASS) {
            throw new Error("SMTP_PASS must be defined");
        }
    }
}