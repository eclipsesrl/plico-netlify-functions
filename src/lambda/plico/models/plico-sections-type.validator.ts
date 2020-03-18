import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from "class-validator";
import { AllowedPlicoSectionTypes, PlicoSectionTypes } from "./plico-sections-type.enum";

@ValidatorConstraint({ name: "IsPlicoSectionType", async: false })
export class IsPlicoSectionType implements ValidatorConstraintInterface {

    validate(section: string, args: ValidationArguments) {
        return AllowedPlicoSectionTypes.includes(section as PlicoSectionTypes)
    }

    defaultMessage(args: ValidationArguments) { // here you can provide default error message if validation failed
        return "Type ($value) is not a supported type";
    }

}