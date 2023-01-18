import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, Query, UseGuards, Req, UseInterceptors, DefaultValuePipe } from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetEntity } from './entities/pet.entity';
import { filterPetDto } from './dto/filter-pet.dto';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common/decorators';
import { diskStorage } from 'multer';
import { editFileName } from 'src/common/editFileName';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('imageFile', {
    storage: diskStorage({
      destination: './uploads',
      filename: editFileName
    })
  }))
  @UseGuards(JwtAuthGuard)
  async createPet(
    @Body() newPet: CreatePetDto,
    @UploadedFile() imageFile : Express.Multer.File,
    @User() user
  ) : Promise<PetEntity> {
    if (imageFile){
      console.log("ok")
      newPet.imageRef=imageFile.filename;
    } else {newPet.imageRef=""}
    return await this.petsService.createPet(newPet, user);
  }

  @Get('petList')
  async getAllPets(
  ) : Promise<PetEntity[]> {
    return await this.petsService.getAllPets();
  }

  @Get('myProfile')
  @UseGuards(JwtAuthGuard)
  async getMyPets(
    @User() user
  ) : Promise<PetEntity[]> {
    return await this.petsService.getMyPets(user);
  }
  
  @Get('filter')
  async filterPets(
    @Query() mesQueryParams : filterPetDto
  ) : Promise<PetEntity[]> {
    return await this.petsService.filterPets(mesQueryParams);
  }

  @Put('update/:id')
  @UseGuards(JwtAuthGuard)
  async updatePet(
    @Param('id', ParseIntPipe) id : number,
    @Body() newPet: UpdatePetDto,
    @User() user
  ) {
    return await this.petsService.updatePet(id, newPet, user);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  async deletePet(
      @Param('id', ParseIntPipe) id : number,
      @User() user
  ) {
      return this.petsService.deletePet(id, user);
  }
  @Get('postsCount')
  async countPosts() {
    return await this.petsService.countPosts();
  }

  @Get('petListPages')
  async getPetsPages(
    @Query('page', new DefaultValuePipe (1), ParseIntPipe) page:number ,
    @Query('limit', new DefaultValuePipe (4), ParseIntPipe) limit:number,
  ) {
    const options = {
      page,
      limit
    }
    return await this.petsService.getAllPetsPaginated(options);
  }
}
