import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {

    @ApiProperty({
        type: [String],
        format: 'binary',
        required: true,
    })
    images: string[];
}
