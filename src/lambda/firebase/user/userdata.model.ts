import { UserPlan } from "./plan.enum";

export class UserData {
    plan: UserPlan
    owned: PlicoId[]
    other: PlicoId[]
    stripeCustomerId?: string;
}

export type PlicoId = string;


export const defaultUserData = {
    plan: UserPlan.FREE,
    //@ts-ignore
    owned: [],
    //@ts-ignore
    other: []
}