export enum PlicoSectionStatus {
  PUBLIC = 'public',
  PRIVATE = 'private',
  PROTECTED = 'protected'
}

export const AllowedPlicoSectionStatus = [
  PlicoSectionStatus.PRIVATE,
  PlicoSectionStatus.PROTECTED,
  PlicoSectionStatus.PUBLIC
];
