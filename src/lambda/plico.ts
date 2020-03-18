import { FunctionHandler } from './utils/function-handler';
import 'reflect-metadata';
import { initFirebase } from './firebase/index';
import { BadRequestException } from './utils/exceptions';
import { getPathsSegments } from './utils/path';
import PlicoHandler from './plico/plico.handler';
import * as EmailValidator from 'email-validator';

let app: any = null;
if (!app) {
  app = initFirebase();
}

let plicoHandler: PlicoHandler = null;

if (!plicoHandler) {
  plicoHandler = new PlicoHandler();
}

const handler: FunctionHandler = async (request, context) => {
  const segments = getPathsSegments(request.path, 'plico');

  if (segments.length == 0) {
    // /plico [POST] Creates a Plico
    return plicoHandler.handleCreatePlico(request);
  }

  if (segments.length == 1) {
    if (segments[0] === 'join') {
      // /plico/join [POST] Joins an User to a Plico
      return plicoHandler.handleJoin(request);
    } else {
      // /plico/:id [PUT | DELETE]
      const id = segments[0];
      switch (request.httpMethod) {
        case 'PUT':
          // /plico/:id [PUT] Updates a Plico data
          return plicoHandler.handleUpdatePlico(request, id);
        case 'DELETE':
          // /plico/:id [DELETE] Deletes a Plico
          return plicoHandler.handleDeletePlico(request, id);
      }
    }
  }
  if (segments.length == 2) {
    // /plico/:id/:action [POST | GET]
    const [id, action] = segments;
    switch (action) {
      case 'invites':
        // /plico/:id/invites [POST] Invite an User to plico
        return plicoHandler.handleInviteUsers(request, id);
      case 'files':
        if (request.httpMethod == "GET") { 
          // /plico/:id/files [GET] Get Read only File Links
          return plicoHandler.handleGetFilesLinks(request, id);
        } else if (request.httpMethod == "POST") {
          // /plico/:id/files [GET] Get Upload only File Links
          return plicoHandler.handleGetFilesUploadLinks(request, id);
        }
        
    }
  }

  if (segments.length == 3) {
    // /plico/:id/:action/:email [DELETE]
    let [id, action, email] = segments;
    email = decodeURIComponent(email);
    if (!EmailValidator.validate(email)) {
      return BadRequestException('INVALID_EMAIL');
    }
    switch (action) {
      case 'invites':
        // /plico/id/invites/:email [DELETE] Deletes an Invite
        return plicoHandler.handleDeleteInvite(request, id, email);
      case 'users':
        // /plico/id/users/:email [DELETE] Deletes an User from Plico
        return plicoHandler.handleDeleteUserFromPlico(request, id, email);
    }
  }

  return BadRequestException('INVALID_FUNCTION_CALLED');
};

exports.handler = handler;
