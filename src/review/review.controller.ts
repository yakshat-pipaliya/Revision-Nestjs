import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';

@ApiTags('Review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new rating' })
  @ApiResponse({ status: 201, description: 'The rating has been successfully created.', type: Review })
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all ratings' })
  @ApiResponse({ status: 200, description: 'Return all ratings.', type: [Review] })
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a rating by id' })
  @ApiResponse({ status: 200, description: 'Return the rating.', type: Review })
  @ApiResponse({ status: 404, description: 'Rating not found.' })
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a rating' })
  @ApiResponse({ status: 200, description: 'The rating has been successfully updated.', type: Review })
  @ApiResponse({ status: 404, description: 'Rating not found.' })
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a rating' })
  @ApiResponse({ status: 200, description: 'The rating has been successfully deleted.', type: Review })
  @ApiResponse({ status: 404, description: 'Rating not found.' })
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }
}
