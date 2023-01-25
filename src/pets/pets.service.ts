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

 /*  async countFilteredPosts (mesQueryParams : filterPetDto) {
    return await this.petRepo.createQueryBuilder("petinfo")
      .where(mesQueryParams.type ? "petinfo.type = :type" : "1=1", {type: mesQueryParams.type})
      .andWhere(mesQueryParams.sex ?"petinfo.sex = :sex" : "1=1", {sex: mesQueryParams.sex})
      .andWhere(mesQueryParams.age ? "petinfo.age = :age" : "1=1", {age: mesQueryParams.age})
      .getCount();
  } */
  
  async paginatedfilteredPets (filteredData : filterPetDto, page: number) {
    console.log("page :" + page)
    console.log(filteredData)
    const where = {};

    if (filteredData.type) {
        where['type'] = filteredData.type;
    }
    if (filteredData.sex) {
        where['sex'] = filteredData.sex;
    }
    if (filteredData.age) {
        where['age'] = filteredData.age;
    }
    console.log(where)
    const filteredPostsCount = await this.petRepo.count({ where });
    console.log(filteredPostsCount)
    const postsPerPage = 3;
    const numberOfPages = Math.ceil(filteredPostsCount/postsPerPage);
    
    const filteredPosts = await this.petRepo.find({
      where,
      skip : postsPerPage * (page - 1),
      take : postsPerPage,
    });

    return { 
      items: filteredPosts,
      total: numberOfPages 
    }

  }


  async getAllPetsPaginated(page: number) {
    const queryBuilder = this.petRepo.createQueryBuilder('petinfo');
    queryBuilder.orderBy('petinfo.id', 'ASC');
    const postsPerPage = 3;
    const [items, total] = await queryBuilder.skip((page-1)* postsPerPage)
                                             .take(postsPerPage)
                                             .getManyAndCount();
    const numberOfPages = Math.ceil(total/postsPerPage);
                                             
    return { 
      items,
      total: numberOfPages
    };

  }

/*   async getAllPetsPaginated(options: IPaginationOptions): Promise<Pagination <PetEntity>> {
    const queryBuilder = this.petRepo.createQueryBuilder('petinfo');
    queryBuilder.orderBy('petinfo.id', 'ASC');
    console.log("called");
    return paginate<PetEntity>(this.petRepo, options);
  } */

}
