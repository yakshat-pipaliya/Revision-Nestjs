import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Review {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    userId: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
    productId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true, min: 1, max: 5 })
    rating: number;
}
export const ReviewSchema = SchemaFactory.createForClass(Review);