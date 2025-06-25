import { IsNotEmpty, IsString, IsEmail, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { USER_MESSAGES } from '../../common/message'

export class LoginUserDto {
    @ApiProperty({ example: USER_MESSAGES.USEREMAIL_EXAMPLE, description: USER_MESSAGES.USEREMAIL_DESCRIPTION })
    @IsNotEmpty({ message: USER_MESSAGES.EMAIL_REQUIRED })
    @IsEmail({}, { message: USER_MESSAGES.INVALID_EMAIL_FORMAT })
    @Matches(USER_MESSAGES.USEREMAILREGEX_DESCRIPTION, {
        message: USER_MESSAGES.INVALID_EMAIL,
    })
    email: string;

    @ApiProperty({ example: USER_MESSAGES.USERPASSWORD_EXAMPLE, description: USER_MESSAGES.USERPASSWORD_DESCRIPTION })
    @IsNotEmpty({ message: USER_MESSAGES.PASSWORD_REQUIRED })
    @IsString()
    @Matches(USER_MESSAGES.USERPASSWORDREGEX_DESCRIPTION, {
        message: USER_MESSAGES.PASSWORD_REQUIREMENTS,
    })
    password: string;
} 