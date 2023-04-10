import * as dotenv from 'dotenv'; 
import Container from "./container";
import { writeFileSync } from "fs";
import moment from "moment";
import { v4 } from "uuid";
import "../application/dependency-injection";
import "../infrastructure/dependency-injection";
import { MyImap } from "../infrastructure/imap/imap.service";
import { ImportInvoiceFromXmlCommandHandler } from "../application/invoice/commands/import-invoice-from-xml/import-invoice-from-xml-command-handler";
import { ImportInvoiceFromXmlCommand } from "../application/invoice/commands/import-invoice-from-xml/import-invoice-from-xml-command";

dotenv.config()

const handler = Container.resolve(ImportInvoiceFromXmlCommandHandler);

async function run() {
  const config = {
    imap: {
      user: process.env.IMAP_USER,
      password: process.env.IMAP_PASSWORD,
      host: process.env.IMAP_HOST,
      port: process.env.IMAP_PORT,
      tls: true,
    },
  };

  const imap = new MyImap(config);
  await imap.connect();
  await imap.openBox();

  const criteria = [];

  criteria.push("UNSEEN");

  criteria.push(["SINCE", moment().format("MMMM DD, YYYY")]);

  const emails = await imap.fetchEmails(criteria);

  for (const email of emails) {
    for (const file of email.files) {
      if (file.mimetype !== "text/xml") continue;
      const buffer = Buffer.from(file.buffer);

      try {
        const filename = `downloads/${v4()}.xml`;
        writeFileSync(filename, buffer);
        const command = new ImportInvoiceFromXmlCommand(filename);
        await handler.execute(command);
      } catch (error) {
        console.error(error);
      }
    }
  }

  await imap.end();
}

export async function FetchEmailsJob() {
  while (true) {
    try {
      await run();
      await new Promise((resolve) => setTimeout(resolve, 1000 * 5));
    } catch (error) {
      console.error(error);
    }
  }
}

