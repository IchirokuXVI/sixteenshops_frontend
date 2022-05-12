import { BaseResource } from "./base-resource.model";
import { User } from "./user.model";

export interface Invoice extends BaseResource {
    date?: Date,
    total_price?: number,
    user: User, // Could be a string reference to user
    products: [{
        combination: string, // Ref to combination
        amount: number,
        price: number
    }]
}