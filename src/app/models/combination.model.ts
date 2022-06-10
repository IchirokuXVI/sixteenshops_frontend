import { BaseResource } from "./base-resource.model";

export interface Combination extends BaseResource {
    name: string,
    price?: number,
    discount?: number,
    options: string[]
}
