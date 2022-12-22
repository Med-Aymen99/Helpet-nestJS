import { PartialType } from '@nestjs/mapped-types';
import { CreatePetDto } from './create-pet.dto';

export class UpdatePetDto extends PartialType(CreatePetDto) {
    name: string;

    type: string;

    breed: string;

    sex: string;

    age: number;
}
