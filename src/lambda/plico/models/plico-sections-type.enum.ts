export enum PlicoSectionTypes {
  MARKDOWN = 'markdown',
  CALENDAR = 'calendar',
  TODOS = 'todos',
  LINKS = 'links',
  INVOICES = 'invoices',
  FILES = 'files'
}

export const AllowedPlicoSectionTypes = [
  PlicoSectionTypes.CALENDAR,
  PlicoSectionTypes.FILES,
  PlicoSectionTypes.INVOICES,
  PlicoSectionTypes.MARKDOWN,
  PlicoSectionTypes.LINKS,
  PlicoSectionTypes.TODOS
];

export const AllowedForFreePlicoSectionTypes = [
  PlicoSectionTypes.MARKDOWN,
  PlicoSectionTypes.LINKS,
  PlicoSectionTypes.TODOS,
  PlicoSectionTypes.FILES
];
