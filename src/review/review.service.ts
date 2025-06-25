import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private readonly ReviewgModel: Model<Review>,
    private readonly productService: ProductService,
    private readonly userService: UserService,
  ) { }

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    try {
      await this.userService.findOne(createReviewDto.userId.toString());
    } catch (error) {
      throw new NotFoundException(`User with ID ${createReviewDto.userId} not found`);
    }

    try {
      await this.productService.findOne(createReviewDto.productId.toString());
    } catch (error) {
      throw new NotFoundException(`Product with ID ${createReviewDto.productId} not found`);
    }
    const createdRating = new this.ReviewgModel(createReviewDto);
    return createdRating.save();
  }


  async findAll(): Promise<Review[]> {
    return this.ReviewgModel.find()
      .populate('userId')
      .populate('productId')
      .exec();
  }

  async findOne(id: string): Promise<Review> {
    const rating = await this.ReviewgModel.findById(id)
      .populate('userId')
      .populate('productId')
      .exec();
    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }
    return rating;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    if (updateReviewDto.userId) {
      try {
        await this.userService.findOne(updateReviewDto.userId.toString());
      } catch (error) {
        throw new NotFoundException(`User with ID ${updateReviewDto.userId} not found`);
      }
    }
    if (updateReviewDto.productId) {
      try {
        await this.productService.findOne(updateReviewDto.productId.toString());
      } catch (error) {
        throw new NotFoundException(`Product with ID ${updateReviewDto.productId} not found`);
      }
    }
    const updatedRating = await this.ReviewgModel
      .findByIdAndUpdate(id, updateReviewDto, { new: true })
      .exec();
    if (!updatedRating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }
    return updatedRating;
  }

  async remove(id: string): Promise<Review> {
    const deletedRating = await this.ReviewgModel.findByIdAndDelete(id).exec();
    if (!deletedRating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }
    return deletedRating;
  }
}
