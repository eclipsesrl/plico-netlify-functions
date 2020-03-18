import { PlicoSection } from './plico-section.model';
import { PendingInvite } from './pending-invite.model';
import { PlicoFile } from './plico-file.model';

export class Plico {
  id: string;
  title: string;
  owner: string;
  collaborators: string[]; // Array of Emails
  client: string | null; // Email of the client
  sections: PlicoSection[];
  invites: PendingInvite[];
  files: PlicoFile[]
}
