import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';


export class CreateReviewDto {
    @ApiProperty({ example: '507f1f77bcr86ce799425045', description: 'ID of the user being rated' })
    @IsNotEmpty()
    userId: Types.ObjectId;

    @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'ID of the product being rated' })
    @IsNotEmpty()
    productId: Types.ObjectId;

    @ApiProperty({ example: 4, description: 'Rating value between 1 and 5' })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;
}
