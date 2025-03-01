import { Person } from "src/person/entity/person.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Film {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    genre: string;

     @ManyToMany(()=> Person, person => person.favouriteMovies )
        @JoinTable({
            name:'person_film',
            joinColumn:{
                name: 'idPerson',
                referencedColumnName: 'id'
            },
            inverseJoinColumn:{
                name: 'idFilm',
                referencedColumnName: 'id'
            }
        })
        favouritePerson:Person[]
    
    constructor(title:string , genre:string){
        this.title = title;
        this.genre =  genre;
    }
}