import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './category.service';

// import { ResponseData } from 'src/global/globalClass';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.categoriesService.findOne(id);
  }
}
