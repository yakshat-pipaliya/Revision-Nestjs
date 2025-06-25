import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PRODUCT_MESSAGES } from '../../common/message'

export class UpdateProductDto {
    @ApiProperty({ example: PRODUCT_MESSAGES.PRODUCTNAME_EXAMPLE, description: PRODUCT_MESSAGES.PRODUCTNAME_DESCRIPTION, required: false })
    @IsOptional()
    @IsString()
    productName?: string;

    @ApiProperty({ example: PRODUCT_MESSAGES.PRODUCTCATEGORY_EXAMPLE, description: PRODUCT_MESSAGES.PRODUCTCATEGORY_DESCRIPTION, required: false })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiProperty({ example: PRODUCT_MESSAGES.PRODUCTBRANDNAME_EXAMPLE, description: PRODUCT_MESSAGES.PRODUCTBRANDNAME_DESCRIPTION, required: false })
    @IsOptional()
    @IsString()
    brandName?: string;

    @ApiProperty({ example: PRODUCT_MESSAGES.PRODUCTDESCRIPTION_EXAMPLE, description: PRODUCT_MESSAGES.PRODUCTDESCRIPTION_DESCRIPTION, required: false })
    @IsOptional()
    @IsString()
    description?: string;
}
