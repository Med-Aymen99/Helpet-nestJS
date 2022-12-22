import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { PetEntity } from './entities/pet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PetEntity])],
  controllers: [PetsController],
  providers: [PetsService]
})
export class PetsModule {}
