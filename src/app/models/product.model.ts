import { BaseResource } from "./base-resource.model";
import { OptionGroup } from "./option-group.model";

export interface Product extends BaseResource {
    name: string,
    price?: number,
    discount?: number,
    images?: string[],
    optionGroups: OptionGroup[]
}
