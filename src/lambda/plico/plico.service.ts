import { UserPlan } from '../firebase/user/plan.enum';
import { UserData } from '../firebase/user/userdata.model';
import { Plico } from './models/plico.model';
import { User } from '../firebase/user/user.model';
import { validateSectionsForUser } from './models/plico-section.validator';
import * as admin from 'firebase-admin';
import { CreatePlicoDTO } from './dto/create-plico.dto';
import { PendingInvite } from './models/pending-invite.model';
import { CreateInviteDTO } from './dto/create-invite-dto';
import { JoinPlicoDTO } from './dto/join-plico-dto';
import { UpdatePlicoDTO } from './dto/update-plico.dto';
import { uuid } from 'uuidv4';
import {
  InternalServerErrorException,
  BadRequestException
} from '../utils/exceptions';
import { OkResponse } from '../utils/event-response';

export class PlicoService {
  private database = admin.firestore();
  constructor() {}

  async canCreatePlico(userdata: UserData): Promise<boolean> {
    switch (userdata.plan) {
      case UserPlan.FREE:
        return userdata.owned.length == 0;
      case UserPlan.LITE:
        return userdata.owned.length < 10;
      case UserPlan.PRO:
        return true;
    }
  }

  /**
   *
   * Creates a plico for the current user, this operation is guarded by the Can Create Plico Guard
   *
   * @param plico
   * @param user
   */
  async createPlico(
    createPlicoDTO: CreatePlicoDTO,
    user: User
  ): Promise<Plico> {
    if (!user.data) {
      console.error(`Missing user data for user id: ${user.uid}`);
      throw InternalServerErrorException();
    }
    createPlicoDTO.sections = validateSectionsForUser(
      createPlicoDTO.sections,
      user.data
    );

    createPlicoDTO.sections.forEach(section => (section.id = uuid()));

    return await this._createPlico(createPlicoDTO, user.uid);
  }

  async updatePlico(
    plicoId: string,
    updatePlicoDTO: UpdatePlicoDTO,
    user: User
  ) {
    if (updatePlicoDTO.sections) {
      updatePlicoDTO.sections = validateSectionsForUser(
        updatePlicoDTO.sections,
        user.data
      );
    }
    if (!updatePlicoDTO.sections || !updatePlicoDTO.title) {
      return BadRequestException('MISSING_DATA');
    }
    try {
      updatePlicoDTO.sections.forEach(section => {
          if (!section.id) {
            section.id = uuid();
          }
        }
      );
      await this.database.doc(`plicos/${plicoId}`).update(updatePlicoDTO);
      return OkResponse('UPDATED');
    } catch (e) {
      console.error(e);
      return InternalServerErrorException('FAILED_TO_UPDATE_PLICO');
    }
  }

  private async _createPlico(
    createPlicoDTO: CreatePlicoDTO,
    userId: string
  ): Promise<Plico> {
    const docRef = await this.database.collection('plicos').add({
      ...createPlicoDTO,
      owner: userId,
      client: null,
      collaborators: [],
      invites: []
    });

    const id = docRef.id;

    await this.addPlicoId(userId, id, 'owned');

    const plico = new Plico();
    plico.id = id;
    plico.client = null;
    plico.collaborators = [];
    plico.owner = userId;
    plico.sections = createPlicoDTO.sections;
    plico.title = createPlicoDTO.title;
    plico.invites = [];

    return plico;
  }

  /**
   * Adds an id in the array of owned or other for the user
   *
   *
   * @param userId
   * @param plicoId
   * @param type
   */
  private async addPlicoId(
    userId: string,
    plicoId: string,
    type: 'other' | 'owned'
  ) {
    const userRef = this.database.collection('users').doc(userId);

    const updateObject: any = {};

    updateObject[type] = admin.firestore.FieldValue.arrayUnion(plicoId);
    await userRef.update(updateObject);
  }

  async getPlicoData(plicoId: string): Promise<Plico> {
    const plico = await this.database.doc(`plicos/${plicoId}`).get();

    // Merge with default properties
    return {
      id: plicoId,
      title: 'Invalid Title',
      collaborators: [],
      owner: '',
      invites: [],
      sections: [],
      client: null,
      files: [],
      ...(plico.data() || {})
    };
  }

  public async removePlico(plicoId: string, plico: Plico, userId: string) {
    try {
      await this.database.doc(`plicos/${plicoId}`).delete();
      await this.removePlicoId(userId, plicoId, 'owned');
      if (plico.client) {
        await this.removePlicoId(plico.client, plicoId, 'other');
      }
      for (let collaborator of plico.collaborators) {
        await this.removePlicoId(collaborator, plicoId, 'other');
      }
      return OkResponse('DELETED');
    } catch (error) {
      console.error(error);
      return InternalServerErrorException(`Failed to delete the plico`);
    }
  }

  /**
   * Removes an id in the array of owned or other for the user
   *
   *
   * @param userId
   * @param plicoId
   * @param type
   */
  private async removePlicoId(
    userId: string,
    plicoId: string,
    type: 'other' | 'owned'
  ) {
    const userRef = this.database.collection('users').doc(userId);

    const updateObject: any = {};

    updateObject[type] = admin.firestore.FieldValue.arrayRemove(plicoId);
    await userRef.update(updateObject);
  }

  public async inviteUser(
    plico: Plico,
    user: User,
    createInviteDTO: CreateInviteDTO
  ) {
    const { type, email } = createInviteDTO;
    switch (type) {
      case 'client':
        if (plico.client != null) {
          return BadRequestException('CLIENT_ALREADY_ACCEPTED');
        }
        if (plico.invites.find(invite => invite.email == email)) {
          return BadRequestException('CLIENT_ALREADY_INVITED');
        }
        break;
      case 'collaborator':
        const actualCollaboratorsInvites = plico.invites.filter(
          invite => invite.type == 'collaborator'
        );
        // Gate for the collaborator limits
        switch (user.data.plan) {
          case UserPlan.FREE:
            return BadRequestException('NOT_ALLOWED_FOR_FREE');
          case UserPlan.LITE:
            if (
              actualCollaboratorsInvites.length + plico.collaborators.length >=
              2
            ) {
              return BadRequestException('LIMIT_REACHED');
            }
            break;
          case UserPlan.PRO:
            if (
              actualCollaboratorsInvites.length + plico.collaborators.length >=
              5
            ) {
              return BadRequestException('LIMIT_REACHED');
            }
            break;
        }
        if (plico.invites.find(invite => invite.email == email)) {
          return BadRequestException('COLLABORATOR_ALREADY_INVITED');
        }
        // Can add a collaborator so let's check it
        if (plico.collaborators.includes(email)) {
          // email alredy inside collaborators
          return BadRequestException('COLLABORATOR_ALREADY_ACCEPTED');
        }
        if (plico.client == email) {
          return BadRequestException('COLLABORATOR_ALREADY_CLIENT');
        }
        break;
    }
    const invite = await this.createInvite(createInviteDTO, plico);
    const updateObject: any = {};
    updateObject['invites'] = admin.firestore.FieldValue.arrayUnion(invite);
    await this.database.doc(`plicos/${plico.id}`).update(updateObject);
    return OkResponse('USER_INVITED');
  }

  private async createInvite(
    client: CreateInviteDTO,
    plico: Plico
  ): Promise<PendingInvite> {
    const invite = await this.database.collection('invites').add({
      ...client,
      id: plico.id,
      title: plico.title
    });

    return {
      id: invite.id,
      ...client
    };
  }

  public async deleteInvite(plico: Plico, email: string) {
    try {
      const invite = plico.invites.find(invite => invite.email == email);
      if (invite) {
        const updateObject: any = {};
        updateObject['invites'] = admin.firestore.FieldValue.arrayRemove(
          invite
        );
        await this.database.doc(`plicos/${plico.id}`).update(updateObject);
        await this.database.doc(`invites/${invite.id}`).delete();
        return OkResponse('INVITE_DELETED');
      } else {
        return BadRequestException('INVITE_NOT_FOUND');
      }
    } catch (e) {
      console.error(e);
      return InternalServerErrorException('FAILED_TO_REMOVE_INVITE');
    }
  }

  private async getUidByEmail(email: string): Promise<string | null> {
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      return userRecord.uid;
    } catch (e) {
      return null;
    }
  }

  public async removeUserFromPlico(plico: Plico, email: string) {
    const userId = await this.getUidByEmail(email);
    if (!userId) {
      return BadRequestException('USER_NOT_FOUND');
    }
    const updateObject: any = {};
    if (plico.client == email) {
      updateObject['client'] = null;
    } else if (plico.collaborators.includes(email)) {
      updateObject['collaborators'] = admin.firestore.FieldValue.arrayRemove(
        email
      );
    } else {
      return BadRequestException('USER_NOT_FOUND_IN_PLICO');
    }
    await this.database.doc(`plicos/${plico.id}`).update(updateObject);
    await this.removePlicoId(userId, plico.id, 'other');
    return OkResponse('USER_REMOVED');
  }

  public async joinPlico(joinPlicoDTO: JoinPlicoDTO, user: User) {
    try {
      const inviteRef = await this.database
        .doc(`invites/${joinPlicoDTO.code}`)
        .get();
      const invite = inviteRef.data() as PendingInvite;

      if (invite.email !== user.email) {
        return BadRequestException('INVALID_PLICO_INVITE_CODE');
      }

      const plicoRef = await this.database.doc(`plicos/${invite.id}`).get();
      const plicoInvites = plicoRef.data().invites;

      const plicoInvite = plicoInvites.find(
        (inv: PendingInvite) =>
          inv.email === invite.email &&
          inv.id == joinPlicoDTO.code &&
          inv.type === invite.type
      ) as PendingInvite; // Pending Invite ID is cross related if the invite is in Invites collection it will refer to the plico id, while if in plico.invites array it will be the Invite ID
      if (!plicoInvite) {
        console.error(`Invite not found inside plico invites`);
        return BadRequestException('INVALID_PLICO_INVITE_CODE');
      }
      const updateObject: any = {};
      updateObject['invites'] = admin.firestore.FieldValue.arrayRemove(
        plicoInvite
      ); // Remove Invite

      if (plicoInvite.type == 'client') {
        updateObject['client'] = user.email; // Add client
      } else {
        updateObject['collaborator'] = admin.firestore.FieldValue.arrayUnion(
          user.email
        ); // Add collaborator
      }

      await this.database.doc(`plicos/${invite.id}`).update(updateObject);
      await this.database.doc(`invites/${joinPlicoDTO.code}`).delete();
      await this.addPlicoId(user.uid, invite.id, 'other');
      return OkResponse('JOINED');
    } catch (e) {
      console.error(e);
      return BadRequestException('INVALID_PLICO_INVITE_CODE');
    }
  }

  public async getFilesUploadLinks(plico: Plico, files: string[]) {
    const bucket = admin.storage().bucket();
   
    const date = Date.now() + 60 * 60000; // 1 Hour
    
    const result = await Promise.all(files.map(async fileName => {
      const file = bucket.file(plico.id + '/' + fileName);
      try {
        const res = await file.getSignedUrl({ expires: date, action: 'write' });
        return {
          id: fileName,
          url: res
        };
      } catch (e) {
        console.error(e);
       return {
          id: fileName,
          url: ''
        };
      }
    }));
   
    return OkResponse(result);
  }

  public async getFilesReadLinks(plico: Plico, files: string[]) {
    const bucket = admin.storage().bucket();
    const result = [];
    const date = Date.now() + 60 * 60000; // 1 Hour
    for (let fileName of files) {
      const file = bucket.file(plico.id + '/' + fileName);
      const [exists] = await file.exists();
      if (!exists) {
        result.push({
          id: fileName,
          url: ''
        });
      } else {
        try {
          const res = await file.getSignedUrl({
            expires: date,
            action: 'read'
          });
          result.push({
            id: fileName,
            url: res
          });
        } catch (e) {
          console.error(e);
          result.push({
            id: fileName,
            url: ''
          });
        }
      }
    }
    return OkResponse(result);
  }
}
