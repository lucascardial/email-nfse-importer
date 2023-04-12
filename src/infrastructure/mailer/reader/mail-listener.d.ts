import { Mail } from "./mail";

export interface IMailListener {
    onMail(mail: Mail): void;
}