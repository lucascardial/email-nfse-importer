export type TupleResult = {
    uid: string;
    name: string;
    cities: {
        code: number;
        name: string;
    }[]
}

export class GetRoutesQueryResult {
    constructor(
        public readonly routes: TupleResult[],
    ) { }
}