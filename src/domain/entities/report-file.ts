import { v4 } from "uuid";

export class ReportFile {
    public readonly uid?: string;
    public readonly fileName: string;
    public readonly filePath: string;
    public readonly fileType: string;
    public readonly createdAt: Date;

    constructor(props: ReportFile) {
        this.uid = props.uid || v4();
        this.fileName = props.fileName;
        this.filePath= props.filePath;
        this.fileType = props.fileType;
        this.createdAt = props.createdAt;
    }
}