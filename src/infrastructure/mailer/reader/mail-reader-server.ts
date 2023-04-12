import Imap from "node-imap";
import MailParser from "mailparser";
import { IMailListener } from "./mail-listener";
import { UnsubscribeMailListener } from "./unsubscribe-mail-listener";
import { MailConnection } from "./mail-connection";
import { Mail } from "./mail";
import { Newable } from "./newable";
import { Container } from "inversify";

export class MailReaderServer {
  private readonly connectionConfig: MailConnection;

  private readonly imap: Imap;

  private readonly emailListeners: Newable<IMailListener>[] = [];

  private readonly criteria: any[] = [];

  private readonly container: Container;

  constructor(connectionConfig: MailConnection, container: Container) {
    this.imap = new Imap({
      user: connectionConfig.user,
      password: connectionConfig.password,
      host: connectionConfig.host,
      port: connectionConfig.port,
      tls: connectionConfig.tls,
    });

    this.connectionConfig = connectionConfig;
    this.container = container;
  }

  addCriteria(criteria: any[]) {
    this.criteria.push(...criteria);
  }

  removeCriteria(criteria: any[]) {
    this.criteria.filter((c) => !criteria.includes(c));
  }

  registerListener(listener: Newable<IMailListener>): UnsubscribeMailListener {
    this.emailListeners.push(listener);

    return {
      onUnsubscribe: () => {
        this.emailListeners.filter((l) => l !== listener);
      },
    };
  }

  start(boxName = "INBOX"): Promise<void> {
    return new Promise((resolve, reject) => {
      this.imap.connect();

      this.imap.once("ready", () => {
        console.log(
          `connected to ${this.connectionConfig.host} as ${this.connectionConfig.user}`
        );

        this.imap.openBox(boxName, false, (err) => {
          if (err) {
            console.log(err);
            return;
          }

          this._log(`opened box ${boxName}`);

          this.imap.on("mail", () => {
            const mail: Mail = new Mail();

            this._log(`new mail arrived in ${boxName}`);

            this.imap.search(this.criteria, (err, results) => {
              if (err) {
                console.log(err);
                return;
              }

              this._log(`found ${results.length} new emails`);

              const fetch = this.imap.fetch(results, {
                bodies: "",
                markSeen: true,
              });

              fetch.on("message", (msg, seqno) => {
                const parser = new MailParser.MailParser();

                
                parser.on("headers", (headers) => {
                  console.log('#1', headers.get("from")?.toString());
                  
                  mail.from_name = headers.get("from")!.valueOf.name;
                  mail.subject =
                    headers.get("subject")?.toString() ?? "No subject";
                  mail.from_address = headers
                    .get("from")!
                    .toString()
                    .toLowerCase();
                  mail.date =
                    headers.get("date")?.toString() ?? new Date().toString();

                  this._log(
                    `Header: from : ${headers.get("from")?.valueOf.name}`
                  );
                  this._log(`Header: subject : ${headers.get("subject")}`);
                  this._log(`Header: date : ${headers.get("date")}`);
                });

                parser.on("data", (data) => {
                  if (data.type === "attachment") {
                    const buffers: Uint8Array[] = [];

                    data.content.on("data", (chunk: Uint8Array) => {
                      buffers.push(chunk);
                    });

                    data.content.on("end", () => {
                      const buffer = Buffer.concat(buffers);
                      const mimeType = data.contentType;
                      const originalName = data.filename;
                      const fileSize = Buffer.byteLength(
                        Buffer.concat(buffers)
                      );

                      mail.attachments.push({
                        buffer,
                        mimeType,
                        originalName,
                        fileSize,
                      });

                      data.release();

                      this._log(
                        `Attachment: ${data.filename} (${buffer.length} bytes)`
                      );

                    });
                  }
                });

                parser.on("end", () => {
                  this._log(`Finished parsing email ${seqno}`);
                });

                parser.on("end", () => {
                  this.emailListeners.forEach((listener: Newable<IMailListener>) => {
                    const listenerInstance = this.container.resolve(listener);
                    listenerInstance.onMail(mail);
                  });
                });

                msg.on("body", (stream) => {
                  stream.pipe(parser);
                });
              });
            });
          });
        });
      });
    });
  }

  _log(msg: any) {
    console.log(`[${this.connectionConfig.user}] `, msg);
  }
}
