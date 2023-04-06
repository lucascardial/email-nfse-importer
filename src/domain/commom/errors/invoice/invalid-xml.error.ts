export class InvalidXmlError extends Error {
  constructor(
    public readonly missingFields: string[],
  ) {
    super('Invalid XML');
  }
}