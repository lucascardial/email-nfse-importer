import { Cnpj } from "../../../../domain/object-values/cnpj";

export type DaillyInvoicesQueryResult = {
    accessKey: string;
    issuerCnpj: Cnpj,
	issuerName: string,
	receiverCnpj: Cnpj,
	receiverName: string,
	street: string,
	streetNumber: string,
	neighborhood: string,
	cityCode: string,
	city: string,
	state: string,
	zipCode: string,
	phone: string,
	quantity: number,
	grossWeight: number,
	totalValue: number,
	issueDate: Date, 
}


	