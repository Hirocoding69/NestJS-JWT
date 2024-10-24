import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    constructor(private readonly authService: AuthService) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const user = await this.authService.validateUser(request.body.email, request.body.password);
        request.user = user;
        return true;
    }
}