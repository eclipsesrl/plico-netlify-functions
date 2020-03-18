import { UserData } from "./userdata.model"

export interface User {
    readonly uid: string
    readonly email: string
    data?: UserData
}
