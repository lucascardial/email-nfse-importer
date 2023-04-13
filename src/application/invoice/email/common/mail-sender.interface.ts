export type MailAttachment = {
    filename: string;
    path: string;
}

export type MailAddress = {
    name: string;
    address: string;
}

export type MailOptions = {
    from: string;
    to: string | MailAddress | Array<string | MailAddress>;
    subject: string;
    text: string;
    html?: string;
    attachments?: MailAttachment[];
}

export interface IMailSender {
    sendMail(mailOptions: MailOptions): Promise<void>;
}