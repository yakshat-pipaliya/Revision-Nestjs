import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './entities/product.entity';
import { PaginationQueryDto } from './dto/pagination-query.dto'
import { PRODUCT_MESSAGES } from 'src/common/message';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findAllBySorting(paginationDto: PaginationQueryDto) {
    const { limit, page, sortBy, sortOrder, productName } = paginationDto;
    const offset = (page - 1) * limit;

    const filter: any = {};
    if (productName) {
      filter.productName = { $regex: productName, $options: 'i' };
    }

    const sortStage: any = {};
    if (sortBy) {
      const sortField = sortBy === 'rating' ? 'avgRating' : sortBy;
      sortStage[sortField] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortStage['avgRating'] = -1;
    }

    const [data, total] = await Promise.all([
      this.productModel.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'productId',
            as: 'reviews',
          },
        },
        {
          $addFields: {
            avgRating: { $round: [{ $avg: '$reviews.rating' }, 2] },
            totalRatings: { $size: '$reviews' },
            highestRating: {
              $max: '$reviews.rating',
            },
          },
        },
        {
          $project: {
            _id: 1,
            productName: 1,
            category: 1,
            brandName: 1,
            description: 1,
            avgRating: { $ifNull: ['$avgRating', 0] },
            totalRatings: { $ifNull: ['$totalRatings', 0] },
            highestRating: { $ifNull: ['$highestRating', 0] },
          },
        },
        { $sort: sortStage },
        { $skip: offset },
        { $limit: Number(limit) },
      ]),
      this.productModel.countDocuments(filter),
    ]);

    if (data.length === 0) {
      throw new NotFoundException(PRODUCT_MESSAGES.PRODUCT_NOT_MATCH);
    }

    return {
      data,
      meta: {
        totalData: total,
        currentDataView: data.length,
        dataPerPageLimit: limit,
        totalPages: Math.ceil(total / limit),
        prevPage: page > 1 ? page - 1 : null,
        currentPage: page,
        nextPage: page < Math.ceil(total / limit) ? page + 1 : null,
      },
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(PRODUCT_MESSAGES.PRODUCT_NOT_FOUND);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException(PRODUCT_MESSAGES.PRODUCT_NOT_FOUND);
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<Product> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(PRODUCT_MESSAGES.PRODUCT_NOT_FOUND);
    }
    return result;
  }
}
