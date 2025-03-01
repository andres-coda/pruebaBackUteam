import { Film } from "src/film/entity/film.entity";
import { Column, PrimaryGeneratedColumn, Entity, ManyToMany, JoinTable } from "typeorm";

@Entity('person')
export class Person {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    birtdate:Date;
    
    @Column()
    hasInsurance: boolean;

    @ManyToMany(()=> Film, film => film.favouritePerson )
    @JoinTable({
        name:'person_film',
        joinColumn:{
            name: 'idFilm',
            referencedColumnName: 'id'
        },
        inverseJoinColumn:{
            name: 'idPerson',
            referencedColumnName: 'id'
        }
    })
    favouriteMovies:Film[]

    constructor(firstName:string, lastName:string, birtdate:Date, hasInsurance:boolean){
        this.firstName =firstName;
        this.lastName = lastName;
        this.birtdate = birtdate;
        this.hasInsurance = hasInsurance;
    }
}