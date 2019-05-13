export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    dateOfBirth: string;
    identityNumber: number;
    address: IAddress;
}

export interface IAddress {
     lineOne: string;
     lineTwo: string;
     city: string;
     country: string;
     postalCode: number;
}
