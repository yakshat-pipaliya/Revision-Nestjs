import { IsNumber, IsString, IsIn, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PRODUCT_MESSAGES } from '../../common/message'

export class PaginationQueryDto {
    @ApiProperty({ example: PRODUCT_MESSAGES.PRODUCTPAGE_EXAMPLE, description: PRODUCT_MESSAGES.PRODUCTPAGE_DESCRIPTION })
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page: number;

    @ApiProperty({ example: PRODUCT_MESSAGES.PRODUCTLIMIT_EXAMPLE, description: PRODUCT_MESSAGES.PRODUCTLIMIT_DESCRIPTION })
    @Type(() => Number)
    @IsNumber()
    @Min(3)
    @Max(100)
    limit: number;

    @ApiProperty({ example: PRODUCT_MESSAGES.PRODUCTSORTBY_EXAMPLE, description: PRODUCT_MESSAGES.PRODUCTSORTBY_DESCRIPTION })
    @IsString()
    @IsIn(['productName', 'category', 'brandName'], { message: 'Invalid sortBy field' })
    sortBy: string;

    @ApiProperty({ example: PRODUCT_MESSAGES.PRODUCTSORTORDER_EXAMPLE, description: PRODUCT_MESSAGES.PRODUCTSORTORDER_DESCRIPTION, required: false })
    @IsOptional()
    @IsString()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc';

    @ApiProperty({ example: PRODUCT_MESSAGES.PRODUCTNAME_EXAMPLE, description: PRODUCT_MESSAGES.PRODUCTNAME_DESCRIPTION, required: false })
    @IsOptional()
    @IsString()
    productName?: string;
}