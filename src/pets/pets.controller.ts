import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseIntPipe, Query } from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetEntity } from './entities/pet.entity';
import { filterPetDto } from './dto/filter-pet.dto';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post('create')
  async createPet(
    @Body() newPet: CreatePetDto
  ) : Promise<PetEntity> {
    return await this.petsService.createPet(newPet);
  }

  @Get('petList')
  async getAllPets() : Promise<PetEntity[]> {
    return await this.petsService.getAllPets();
  }
  
  @Get('filter')
  async filterPets(
    @Query() mesQueryParams : filterPetDto
  ) : Promise<PetEntity[]> {
    return await this.petsService.filterPets(mesQueryParams);
  }

  // Modifier la route du front !!! 
  @Put('update/:id')
  async updatePet(
    @Param('id', ParseIntPipe) id : number,
    @Body() newPet: UpdatePetDto
  ) : Promise<PetEntity> {
    return await this.petsService.updatePetDto(id, newPet);
  }

  @Delete(':id')
  async deletePet(
      @Param('id', ParseIntPipe) id : number
  ) {
      return this.petsService.deletePet(id);
  }


}
