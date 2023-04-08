import Container from "./container";
import { DaillyInvoicesXmlExportService } from "../application/invoice/export/dailly-invoices-export/dailly-invoices-export.service";


export async function ExportToXmlJob() {
    const service = Container.get(DaillyInvoicesXmlExportService);
    await service.execute()
}