import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './entities/review.entity';
import { ProductModule } from '../product/product.module';
import { Product, ProductSchema } from '../product/entities/product.entity';
import { UserModule } from '../user/user.module';
import { User, UserSchema } from '../user/entities/user.entity'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    ProductModule,
    UserModule
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService]
})
export class ReviewModule { }
