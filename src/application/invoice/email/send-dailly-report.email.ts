import { inject, injectable } from "inversify";
import { IMailSender, MailOptions } from "./common/mail-sender.interface";
import { IReportFileRepository } from "../../persistence/report-file-repository.interface";
import moment from "moment";

@injectable()
export class SendDaillyReportToEmail {
    constructor(
        @inject("IMailSender") private readonly _mailSender: IMailSender,
        @inject("IReportFileRepository") private readonly repository: IReportFileRepository
    ) {}

    async execute(date: Date): Promise<void> {
        const reportFiles = await this.repository.findByDate(date);
        
        const humanDate = moment.utc(date).format("DD/MM/YYYY");

        const mailOptions: MailOptions = {
            from: process.env.SMTP_USER!,
            // to: ['lucas@codeall.com.br'],
            to: ['lucas@codeall.com.br', 'higornoleto@deshowexpress.com.br', 'adm-slz@deshowexpress.com.br'],
            subject: `Relatório diário de notas recebidas em ${humanDate}`,
            text: `Não houve notas recebidas em ${humanDate}.`,
            html: `<h3>Não houve notas recebidas em ${humanDate}.</h3>`,
        };

        if (reportFiles.length > 0) {
            mailOptions.text = `
                Relatório diário de notas recebidas em ${humanDate}.
                Segue em anexo o relatório diário de notas recebidas em ${humanDate}.

                Deshow Express Painel
                Este é um e-mail automático, por favor não responda.
            `,

            mailOptions.html = `
                <h3>Relatório diário de notas recebidas em ${humanDate}</h3>
                <p>Segue em anexo o relatório diário de notas recebidas em ${humanDate}.</p>

                <p>Deshow Express Painel</p>
                <small>Este é um e-mail automático, por favor não responda.</small>
            `,
            mailOptions.attachments = reportFiles.map(reportFile => ({
                filename: reportFile.fileName,
                path: reportFile.filePath,
            }));

        }

        await this._mailSender.sendMail(mailOptions);
    }
}