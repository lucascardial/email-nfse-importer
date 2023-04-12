import { MailAttachment } from "./mail-attachment";

export class Mail {
    public from_name: string = '';
    public from_address: string = '';
    public subject: string = '';
    public date: string = '';
    public attachments: MailAttachment[] = [];
    public body: string = '';   
}