import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Image, ImageDocument } from './entities/image.entity';

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

  constructor(
    @InjectModel(Image.name) private readonly imageModel: Model<ImageDocument>,
  ) { }

  async create(createImageDto: CreateImageDto): Promise<Image> {
    try {
      const image = new this.imageModel(createImageDto);
      return await image.save();
    } catch (error) {
      this.logger.error(`Failed to create image: ${error.message}`, error.stack);
      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('Failed to create image');
    }
  }

  async findAll(): Promise<Image[]> {
    try {
      return await this.imageModel.find().exec();
    } catch (error) {
      this.logger.error(`Failed to fetch images: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch images');
    }
  }

  async findOne(id: string): Promise<Image> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid Image ID format');
    }

    try {
      const image = await this.imageModel.findById(id).exec();
      if (!image) {
        throw new NotFoundException(`Image with ID ${id} not found`);
      }
      return image;
    } catch (error) {
      this.logger.error(`Failed to find image ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch image ${id}`);
    }
  }

  async update(id: string, updateImageDto: UpdateImageDto, newImages: string[]): Promise<Image> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid Image ID format');
    }

    try {
      const existingImage = await this.imageModel.findById(id).exec();
      if (!existingImage) {
        throw new NotFoundException(`Image with ID "${id}" not found`);
      }
      const combinedImages = [...(existingImage.images || []), ...newImages];
      const updatedData = {
        ...updateImageDto,
        images: combinedImages,
      };
      const updatedImage = await this.imageModel
        .findByIdAndUpdate(id, updatedData, { new: true, runValidators: true })
        .exec();
      if (!updatedImage) {
        throw new NotFoundException(`Image with ID "${id}" not found`);
      }
      return updatedImage;
    } catch (error) {
      this.logger.error(`Failed to update image ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(`Failed to update image ${id}`);
    }
  }

  async remove(id: string): Promise<Image> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid Image ID format');
    }

    try {
      const result = await this.imageModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Image with ID ${id} not found`);
      }
      return result;
    } catch (error) {
      this.logger.error(`Failed to delete image ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete image ${id}`);
    }
  }

  async removeImage(id: string, image: string): Promise<Image> {
    const imagesFind = await this.imageModel.findById(id).exec();
    if (!imagesFind) {
      throw new NotFoundException(`Image with ID ${id} not found`)
    }
    const removeImages = (imagesFind.images || []).filter(img => img !== image)
    imagesFind.images = removeImages;
    await imagesFind.save();
    return imagesFind
  }

}