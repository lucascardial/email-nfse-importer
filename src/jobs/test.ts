import Container from "./container";
import { GenerateDaillyReportJob } from "../application/invoice/jobs/dailly-report/generate-dailly-report.job";
import moment from "moment";

import * as dotenv from "dotenv";

dotenv.config();

const dates = ["2023-04-11", "2023-04-12", "2023-04-13"];

dates.forEach((date) => {
  const fireDate = moment(date).toDate();

  const job = Container.get(GenerateDaillyReportJob);
  job
    .execute(fireDate)
    .then(() => {
      console.log("done");
    })
    .catch((err) => {
      console.log(err);
    });
});
