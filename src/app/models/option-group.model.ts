import { BaseResource } from "./base-resource.model";
import { Option } from './option.model';

export interface OptionGroup extends BaseResource {
    name: string,
    options?: Option[]
}