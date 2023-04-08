import { writeFileSync } from "fs";
import moment from "moment";
import { v4 } from "uuid";
import "../application/dependency-injection";
import "../infrastructure/dependency-injection";
import Container from "./container";
import { MyImap } from "../infrastructure/imap/imap.service";
import { ImportInvoiceFromXmlCommandHandler } from "../application/invoice/commands/import-invoice-from-xml/import-invoice-from-xml-command-handler";
import { ImportInvoiceFromXmlCommand } from "../application/invoice/commands/import-invoice-from-xml/import-invoice-from-xml-command";


const handler = Container.resolve(ImportInvoiceFromXmlCommandHandler);

async function run() {
  const config = {
    imap: {
      user: "lucas@codeall.com.br",
      password: "Sd34D!@#456",
      host: "imap.secureserver.net",
      port: 993,
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

