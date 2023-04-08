import schedule from 'node-schedule';
import { ExportToXmlJob } from './dailly_invoice_xml_export';
import { FetchEmailsJob } from './fetch_email_attachments';

// schedule fetch email job to every 1 minute
schedule.scheduleJob('*/1 * * * *', FetchEmailsJob);

// schedule export to xml job to every day at 00:00
schedule.scheduleJob('0 0 * * *', ExportToXmlJob);