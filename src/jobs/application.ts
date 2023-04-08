import schedule from 'node-schedule';
import * as dotenv from 'dotenv'; 

import { ExportToXmlJob } from './dailly_invoice_xml_export';

dotenv.config()

// schedule export to xml job to every day at 00:00
schedule.scheduleJob('0 0 * * *', ExportToXmlJob);