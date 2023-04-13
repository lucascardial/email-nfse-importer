import { inject, injectable } from "inversify";
import { IReportFileRepository } from "../../../application/persistence/report-file-repository.interface";
import { ReportFile } from "../../../domain/entities/report-file";
import { IDBConnection } from "../connection/commom/db-connection.interface";
import moment from "moment";

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

    // delete oldest version of the file
    const queryDelete = `
            DELETE FROM report_files
            WHERE filename = $1
        `;

    const paramsDelete = [reportFile.fileName];

    await this.dbConnection.query(queryDelete, paramsDelete);

    const query = `
            INSERT INTO report_files (uid, filename, filepath, filetype, created_at)
            VALUES ($1, $2, $3, $4, $5)
        `;

    const params = [
      reportFile.uid,
      reportFile.fileName,
      reportFile.filePath,
      reportFile.fileType,
      moment.utc(reportFile.createdAt).format("YYYY-MM-DD"),
    ];

    await this.dbConnection.query(query, params);
  }

  async findByDate(date: Date): Promise<ReportFile[]> {

    const query = `
            SELECT * FROM report_files
            WHERE created_at = $1
        `;
    const params = [moment.utc(date).format("YYYY-MM-DD")];

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
