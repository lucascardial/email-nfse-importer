export class InvoiceError {
    constructor(
        public readonly fileName: string,
        public readonly errorJson: string
    ) {}

    public static newFromJson(json: { errorJson: string, fileName: string}): InvoiceError {
        return new InvoiceError(json.fileName, json.errorJson);
    }
}