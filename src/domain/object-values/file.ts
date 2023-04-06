export class File {
    constructor(
        public readonly fieldname: string,
        public readonly originalname: string,
        public readonly encoding: string,
        public readonly mimetype: string,
        public readonly buffer: Buffer,
        public readonly size: number
    ) {}

   public static newFromJson(json: Record<string, never>): File {
    return new File(
        json.fieldname,
        json.originalname,
        json.encoding,
        json.mimetype,
        json.buffer,
        json.size
    );
    }

    public getExtension(): string {
        const extension = this.originalname.split('.').pop();

        if(!extension) {
            return this.fieldname
        }

        return extension;
    }
}