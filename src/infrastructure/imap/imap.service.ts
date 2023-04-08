import Imap, { } from 'node-imap'
import MailParser from'mailparser';

export class MyImap {
    private readonly imap: Imap;

    constructor(config: Record<string, any>) {
        this.imap = new Imap(config.imap);
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.imap.once('error', (err) => {
                reject(err);
            });
            this.imap.once('ready', () => {
                resolve('ready');
            });
            this.imap.connect();
        });
    }

    end() {
        return new Promise((resolve) => {
            this.imap.once('close', () => {
                this._log('ended');
                resolve('ended');
            });

            this.imap.end();
        });
    }

    openBox(boxName = 'INBOX') {
        return new Promise((resolve, reject) => {
            this.imap.openBox(boxName, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(boxName);
            });
        });
    }

    async fetchEmails(criteria: any[]): Promise<any[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const emails: any[] = [];
                const results = await this._search(criteria);

                if (results.length === 0) {
                    return resolve(emails);
                }

                const fetch = this.imap.fetch(results, {
                    bodies: '',
                    markSeen: true
                });

                let emailsProcessed = 0;
                fetch.on('message', async (msg, seqno) => {
                    const email = await this._processMessage(msg, seqno);
                    emails.push(email);

                    emailsProcessed++;
                    if (emailsProcessed === results.length) {
                        resolve(emails);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    _processMessage(msg: any, seqno: any) {
        return new Promise((resolve, reject) => {
            this._log(`Processing msg ${seqno}`);

            const email: Record<string, any> = {};
            email.files = [];

            const parser = new MailParser.MailParser();
            parser.on('headers', (headers) => {
                
                
                email.from_name = headers.get('form')?.valueOf.name;
                email.from_address = headers.get('from')?.valueOf.name.toLowerCase();
                email.subject = headers.get('subject');
                email.date = headers.get('date');

                this._log(`Header: from_name : ${email.from_name}`);
                this._log(`Header: from_address : ${email.from_address}`);
                this._log(`Header: subject : ${email.subject}`);
                this._log(`Header: date : ${email.date}`);
            });

            parser.on('data', (data) => {
                if (data.type === 'attachment') {
                    const buffers: any[] = [];

                    data.content.on('data', (buffer: any) => {
                        buffers.push(buffer);
                    });

                    data.content.on('end', () => {
                        const file = {
                            buffer: Buffer.concat(buffers),
                            mimetype: data.contentType,
                            size: Buffer.byteLength(Buffer.concat(buffers)),
                            originalname: data.filename,
                        };
        
                        
                        email.files.push(file);
                        data.release();
                    });
                } else if (data.type === 'text') {
                    email.body = data.text;
                }
            });

            parser.on('error', (err) => {
                reject(err);
            });

            parser.on('end', () => {
                resolve(email);
            });

            msg.on('body', function(stream: any) {
                stream.on('data', function(chunk: any) {
                    parser.write(chunk);
                });
            });
            msg.once('attributes', function(attrs: any) {
                email.uid = attrs.uid;
            });
            msg.once('end', () => {
                this._log(`Finished msg ${seqno}`);

                parser.end();
            });
        });
    }

    async _search(criteria: any[]): Promise<number[]> {
        return new Promise((resolve, reject) => {
            this.imap.search(criteria, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });
    }

    _log(msg: any) {
        console.log(msg);
    }
}