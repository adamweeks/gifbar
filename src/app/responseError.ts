/**
 * ResponseError extends Error and adds an optional imageUrl.
 */
export class ResponseError extends Error {
    constructor(message: string, public imageUrl?: string) {
        super(message);
    }
}
