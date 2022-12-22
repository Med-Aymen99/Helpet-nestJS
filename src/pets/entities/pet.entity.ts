import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TimesstampEntities } from "./generics.entity";

@Entity('petinfo')
export class PetEntity extends TimesstampEntities{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    type: string;

    @Column()
    breed: string;

    @Column()
    sex: string;

    @Column()
    age: number;
}
