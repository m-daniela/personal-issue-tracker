
export class APIResponseError extends Error {
    constructor (message){
        super(message);
        this.name = "APIResponseError";
    }
}