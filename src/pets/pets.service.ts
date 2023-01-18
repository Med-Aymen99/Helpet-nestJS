import { Injectable, NotFoundException } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreatePetDto } from './dto/create-pet.dto';
import { filterPetDto } from './dto/filter-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetEntity } from './entities/pet.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(PetEntity)
    private petRepo: Repository<PetEntity>,
    private userService: UserService
     
) {}
  
  async createPet(pet: CreatePetDto, user) : Promise<PetEntity>{
    const newPet = this.petRepo.create(pet);
    newPet.user = user;
    return await this.petRepo.save(newPet);
  }

  async getAllPets() {
    return await this.petRepo.find();
  }

  async getMyPets(user) {
    return await this.petRepo.find({
      where: {
        user: user
      }
    });
  }

  async filterPets (mesQueryParams : filterPetDto) : Promise<PetEntity[]>{
     return await this.petRepo.createQueryBuilder("petinfo")
      .where(mesQueryParams.type ? "petinfo.type = :type" : "1=1", {type: mesQueryParams.type})
      .andWhere(mesQueryParams.sex ?"petinfo.sex = :sex" : "1=1", {sex: mesQueryParams.sex})
      .andWhere(mesQueryParams.age ? "petinfo.age = :age" : "1=1", {age: mesQueryParams.age})
      .getMany();
  }

  async updatePet (id : number , todo : UpdatePetDto, user){
    const newPet = await this.petRepo.preload({
        id,
        ...todo
    })
    if (!newPet)
        throw new NotFoundException(`Le pet d'id ${id} n'existe pas`)
    if (!this.userService.isOwnerOrAdmin(newPet, user))
        throw new UnauthorizedException();
    
        return await this.petRepo.save(newPet);
  }

  async deletePet(id: number, user) {
    const petToDelete = await this.findPetById(id);
    if (!this.userService.isOwnerOrAdmin(petToDelete, user)) {
      console.log("not owner")
      throw new UnauthorizedException();
    }
    return await this.petRepo.delete(id);
  }

  async findPetById(id: number ) {
    const pet = await this.petRepo.findOneBy({
        id : id
    })
    if (! pet) {
        throw new NotFoundException(`Le pet d'id ${id} n'existe pas`)
    }
    return pet;
  }

  async countPosts() {
    return await this.petRepo.count();
  }

  async getAllPetsPaginated(options: IPaginationOptions): Promise<Pagination <PetEntity>> {
    const queryBuilder = this.petRepo.createQueryBuilder('petinfo');
    queryBuilder.orderBy('petinfo.id', 'ASC');
    return paginate<PetEntity>(this.petRepo, options);
  }

}
