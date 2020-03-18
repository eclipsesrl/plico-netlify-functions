import { PlicoSection } from './plico-section.model';
import { UserData } from '../../firebase/user/userdata.model';
import { UserPlan } from '../../firebase/user/plan.enum';
import { AllowedForFreePlicoSectionTypes } from './plico-sections-type.enum';

export function validateSectionsForUser(
  sections: PlicoSection[],
  userdata: UserData
) {
  switch (userdata.plan) {
    case UserPlan.FREE: {
      sections = sections.filter(section =>
        AllowedForFreePlicoSectionTypes.includes(section.type)
      );
      return sections.slice(0, FREE_LIMIT);
    }
    case UserPlan.LITE:
      return sections.slice(0, LITE_LIMIT);
    case UserPlan.PRO:
      return sections;
    default: {
      sections = sections.filter(section =>
        AllowedForFreePlicoSectionTypes.includes(section.type)
      );
      return sections.slice(0, FREE_LIMIT);
    }
  }
}

export const FREE_LIMIT = 5;
export const LITE_LIMIT = 10;
