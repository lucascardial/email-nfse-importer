import * as dotenv from 'dotenv'
import { MailReaderServer } from "../infrastructure/mailer/reader/mail-reader-server";
import { container } from "./dependency-injection";
import { ImportNfseAttachmentListener } from './listeners/download-nfse-attachment.listener';

dotenv.config();

const server: MailReaderServer = new MailReaderServer({
    user: process.env.IMAP_USER!,
    password: process.env.IMAP_PASSWORD!,
    host: process.env.IMAP_HOST!,
    port: parseInt(process.env.IMAP_PORT!),
    tls: true,
}, container);

server.addCriteria(['UNSEEN']);

server.registerListener(ImportNfseAttachmentListener);

server.start();