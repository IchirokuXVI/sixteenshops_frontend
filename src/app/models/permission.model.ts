import { BaseResource } from "./base-resource.model";

export interface Permission extends BaseResource {
    name: string,
    description?: string
}