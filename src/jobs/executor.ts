import schedule from 'node-schedule';
import * as dotenv from 'dotenv'; 
import Container from "./container";
import { GenerateDaillyReportJob } from '../application/invoice/jobs/dailly-report/generate-dailly-report.job';

dotenv.config();

// schedule to generate reports every day at 00:00
schedule.scheduleJob('0 0 * * *', async (fireDate: Date) => {
    const job = Container.get(GenerateDaillyReportJob);
    await job.execute(fireDate)
});