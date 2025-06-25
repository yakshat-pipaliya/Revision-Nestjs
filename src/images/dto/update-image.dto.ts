import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateImageDto {
    @ApiProperty({
        type: [String],
        format: 'binary',
        required: false,
    })
    @IsOptional()
    images?: string[];
}
