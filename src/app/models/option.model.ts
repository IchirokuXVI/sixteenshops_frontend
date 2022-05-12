import { BaseResource } from "./base-resource.model";

export interface Option extends BaseResource {
    name: string,
    order: number
}