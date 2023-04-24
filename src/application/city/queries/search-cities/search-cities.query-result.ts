export type Props = {
    code: number
    name: string
}

export class SearchCitiesQueryResult {
    constructor(
        public readonly cities: Props[]
    ) { }
}