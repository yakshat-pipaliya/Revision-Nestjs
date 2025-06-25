import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PRODUCT_MESSAGES } from '../../common/message'

export class CreateProductDto {
    @ApiProperty({ example: PRODUCT_MESSAGES.PRODUCTNAME_EXAMPLE, description: PRODUCT_MESSAGES.PRODUCTNAME_DESCRIPTION })
    @IsNotEmpty()
    @IsString()
    productName: string;

    @ApiProperty({ example: PRODUCT_MESSAGES.PRODUCTCATEGORY_EXAMPLE, description: PRODUCT_MESSAGES.PRODUCTCATEGORY_DESCRIPTION })
    @IsNotEmpty()
    @IsString()
    category: string;

    @ApiProperty({ example: PRODUCT_MESSAGES.PRODUCTBRANDNAME_EXAMPLE, description: PRODUCT_MESSAGES.PRODUCTBRANDNAME_DESCRIPTION })
    @IsNotEmpty()
    @IsString()
    brandName: string;

    @ApiProperty({ example: PRODUCT_MESSAGES.PRODUCTDESCRIPTION_EXAMPLE, description: PRODUCT_MESSAGES.PRODUCTDESCRIPTION_DESCRIPTION })
    @IsNotEmpty()
    @IsString()
    description: string;
}
