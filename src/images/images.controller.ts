import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseInterceptors, UploadedFiles, BadRequestException,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Image } from './entities/image.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';
import { ApiBody, ApiConsumes, ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) { }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateImageDto })
  create(
    @Body() createImageDto: CreateImageDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('File upload failed.');
    }
    createImageDto['images'] = files.map((file) => `/uploads/images/${file.filename}`);
    return this.imagesService.create(createImageDto);
  }

  @Get()
  findAll() {
    return this.imagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 10, multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateImageDto })
  async update(
    @Param('id') id: string,
    @Body() updateImageDto: UpdateImageDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const newImage = files && files.length > 0 ? files.map(file => `/uploads/images/${file.filename}`) : []
    return this.imagesService.update(id, updateImageDto, newImage);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(id);
  }

  @Delete(':id/image')
  @ApiParam({ name: 'id', description: 'images ID' })
  @ApiBody({ schema: { properties: { image: { type: 'string', example: '/uploads/institute/filename.jpg' } } } })
  async removeImage(
    @Param('id') id: string,
    @Body('image') image: string
  ) {
    if (!image) {
      throw new BadRequestException('File upload failed.');
    }
    return this.imagesService.removeImage(id, image);
  }
}
