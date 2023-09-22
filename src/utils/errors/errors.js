
export class APIResponseError extends Error {
    constructor (message){
        super(message);
        this.name = "APIResponseError";
    }
}

export class SelectedProjectError extends Error {
    constructor (message="There was an error while selecting the project"){
        super(message);
        this.name = "SelectedProjectError";
    }
}


export class FilterError extends Error {
    constructor (message){
        super(message);
        this.name = "FilterError";
    }
}