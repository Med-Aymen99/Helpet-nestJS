import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePetDto } from './dto/create-pet.dto';
import { filterPetDto } from './dto/filter-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetEntity } from './entities/pet.entity';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(PetEntity)
    private petRepo: Repository<PetEntity>,
     
) {}
  
  async createPet(pet: CreatePetDto) : Promise<PetEntity>{
    return await this.petRepo.save(pet);
  }

  async getAllPets() {
    return await this.petRepo.find();
  }
  async filterPets (mesQueryParams : filterPetDto) : Promise<PetEntity[]>{
    return await this.petRepo.find(
      { where : [
              { 
                type: mesQueryParams.type,
                sex: mesQueryParams.sex,
                age: mesQueryParams.age
              
              }
      ]}
    )
  }
  

  async updatePetDto (id : number , todo : UpdatePetDto){
    const newTodo = await this.petRepo.preload({
        id,
        ...todo
    })
    if (!newTodo) {
        throw new NotFoundException(`Le pet d'id ${id} n'existe pas`)

    }
    return await this.petRepo.save(newTodo);
  }

  async deletePet(id: number) {
    return await this.petRepo.delete(id);
  }

}
