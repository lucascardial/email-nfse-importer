import { ReportFile } from "../../domain/entities/report-file";

export interface IReportFileRepository {
    save(reportFile: ReportFile): Promise<void>;
    getByUid(uid: string): Promise<ReportFile | undefined>;
    findByDate(date: Date): Promise<ReportFile[]>;
}