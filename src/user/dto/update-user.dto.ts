import { IsOptional, IsString, IsEmail, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { USER_MESSAGES } from '../../common/message'

export class UpdateUserDto {
    @ApiProperty({ example: USER_MESSAGES.USERNAME_EXAMPLE, description: USER_MESSAGES.USERNAME_DESCRIPTION })
    @IsOptional()
    @IsString()
    userName?: string;

    @ApiProperty({ example: USER_MESSAGES.USEREMAIL_EXAMPLE, description: USER_MESSAGES.USEREMAIL_DESCRIPTION, required: false })
    @IsOptional()
    @IsEmail()
    @Matches(USER_MESSAGES.USEREMAILREGEX_DESCRIPTION, {
        message: USER_MESSAGES.INVALID_EMAIL,
    })
    email?: string;

    @ApiProperty({ example: USER_MESSAGES.USERPASSWORD_EXAMPLE, description: USER_MESSAGES.USERPASSWORD_DESCRIPTION, required: false })
    @IsOptional()
    @IsString()
    @Matches(USER_MESSAGES.USERPASSWORDREGEX_DESCRIPTION, {
        message: USER_MESSAGES.PASSWORD_REQUIREMENTS,
    })
    password?: string;
}
