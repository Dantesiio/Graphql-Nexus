import { applyDecorators, UseGuards } from "@nestjs/common";
import { ValidRoles } from "src/auth/enums/valid-roles.enum";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth/jwt-auth.guard";
import { UserRoleGuard } from "src/auth/guards/user-role/user-role.guard";
import { RoleProtected } from "../role-protected/role-protected.decorator";

export function Auth(...roles: ValidRoles[]){
    return applyDecorators(
        RoleProtected(...roles),
        UseGuards(JwtAuthGuard, UserRoleGuard)
    )
}