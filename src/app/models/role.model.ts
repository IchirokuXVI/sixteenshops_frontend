import { BaseResource } from "./base-resource.model";

export interface Role extends BaseResource {
    name: string,
    description?: string,
    permissions?: string[] // Refs to permission
}