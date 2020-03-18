import { UserService } from './user/user.service';

export class AuthGuard {
  constructor(private userService: UserService) {}

  async isAuthenticated(
    request: any,
    requiresUserDataData = false
  ): Promise<boolean> {
    const { authorization } = request.headers;

    if (!authorization) {
      return false;
    }

    try {
      const user = await this.userService.validateUser(
        authorization.replace('Bearer ', '')
      );
      if (user) {
        request.user = user;
        if (requiresUserDataData) {
          request.user.data = await this.userService.getUserdata(user.uid);
        }
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}
