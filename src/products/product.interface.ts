export interface Product {
    name : string;
    price : number;
    quantoty : number;
    image : string;
}

export interface UnitProduct extends Product {
    id : string
}

export interface Products {
    [key : string] : UnitProduct
}