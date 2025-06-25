import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
    @Prop({ required: true, unique: true })
    productName: string;

    @Prop({ required: true })
    category: string;

    @Prop({ required: true })
    brandName: string;

    @Prop({ required: true })
    description: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
