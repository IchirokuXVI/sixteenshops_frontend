import { BaseResource } from "./base-resource.model";

export interface Permission extends BaseResource {
    name: string,
    description?: string,
    long_description?: string
}
