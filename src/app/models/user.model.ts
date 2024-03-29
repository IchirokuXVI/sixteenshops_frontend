import { BaseResource } from "./base-resource.model";
import { Permission } from "./permission.model";

export interface User extends BaseResource {
    email: string,
    name?: string,
    avatar?: string,
    phone?: string,
    role?: string, // Ref to role,
    permissions?: Permission[] | [{
      permission: string | Permission, // Ref to permission
      allow: boolean
    }]
}
