export type MailAttachment = {
    buffer: Buffer;
    mimeType: string;
    fileSize: number;
    originalName: string;
}