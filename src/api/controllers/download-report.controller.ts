import { inject, injectable } from "inversify";
import { IReportFileRepository } from "../../application/persistence/report-file-repository.interface";
import { Request, Response } from "express";
import { rootDir } from "../helpers";

@injectable()
export class DownloadReportController {
    constructor(
        @inject("IReportFileRepository") private readonly reportRepository: IReportFileRepository
    ){}

    async downloadFile(request: Request, response: Response): Promise<any> {

        const { file_uid } = request.query;

        if(!file_uid) {
            return response.status(400).json({
                message: "Informe o uid do arquivo"
            });
        }
        
        const reportFile = await this.reportRepository.getByUid(file_uid as string);

        if(!reportFile) {
            return response.status(404).json({
                message: "Arquivo não encontrado"
            });
        }
        
        try {
            return response.download(reportFile.filePath, reportFile.fileName);
        } catch (error) {
            return response.status(404).json({
                message: "Arquivo não encontrado"
            });
        }
    }
}