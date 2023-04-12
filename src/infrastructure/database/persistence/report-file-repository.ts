import { inject, injectable } from "inversify";
import { IReportFileRepository } from "../../../application/persistence/report-file-repository.interface";
import { ReportFile } from "../../../domain/entities/report-file";
import { IDBConnection } from "../connection/commom/db-connection.interface";

@injectable()
export class ReportFileRepository implements IReportFileRepository {
  constructor(
    @inject('IDBConnection')  private readonly dbConnection: IDBConnection
) {
}

  async getByUid(uid: string): Promise<ReportFile | undefined> {
    const query = `
            SELECT * FROM report_files
            WHERE uid = $1
        `;
    const params = [uid];

    const result = await this.dbConnection.query(query, params);

    if (result.rowCount === 0) {
      return undefined;
    }

    const row = result.rows[0];

    return new ReportFile({
      uid: row.uid,
      fileName: row.filename,
      filePath: row.filepath,
      fileType: row.filetype,
      createdAt: row.created_at,
    });
  }

  async save(reportFile: ReportFile): Promise<void> {
    const query = `
            INSERT INTO report_files (uid, filename, filepath, filetype, created_at)
            VALUES ($1, $2, $3, $4, $5)
        `;

    const params = [
      reportFile.uid,
      reportFile.fileName,
      reportFile.filePath,
      reportFile.fileType,
      reportFile.createdAt,
    ];

    await this.dbConnection.query(query, params);
  }

  async findByDate(date: string): Promise<ReportFile[]> {
    const query = `
            SELECT * FROM report_files
            WHERE created_at = $1
        `;
    const params = [date];

    console.log(`
SELECT * FROM report_files
WHERE created_at = ${date}
`);

    const result = await this.dbConnection.query(query, params);

    return result.rows.map(
      (row: Record<string, never>) =>
        new ReportFile({
          uid: row.uid,
          fileName: row.filename,
          filePath: row.filepath,
          fileType: row.filetype,
          createdAt: row.created_at,
        })
    );
  }
}
