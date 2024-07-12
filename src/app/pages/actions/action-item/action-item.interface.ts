import { actionTypeIcons } from "src/app/common/constants";
import { ActionType } from "src/app/db/entities/action.entity";

export interface ActionItem {
    get icon(): typeof actionTypeIcons[ActionType] 
}