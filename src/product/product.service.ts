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

  async findAllBySorting(paginationQuery: PaginationQueryDto) {
    const { limit, page, sortBy, sortOrder, productName } = paginationQuery

    const skip = (page - 1) * limit;
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    const filter: any = {};
    if (productName) {
      filter.productName = { $regex: productName, $options: 'i' };
    }

    const [data, total] = await Promise.all([
      this.productModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .collation({ locale: 'en', strength: 4 })
        .sort(sort)
        .exec(),
      this.productModel.countDocuments(filter),
    ]);
    if (data.length === 0) {
      throw new NotFoundException(PRODUCT_MESSAGES.PRODUCT_NOTMATCHING);
    }
    const totalPages = Math.ceil(total / limit);
    const currentPage = page;
    const previousPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      previousPage,
      currentPage,
      nextPage
    }
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
