import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entity/person.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { DtoPerson } from './dto/dtoPerson.dto';
import { DtoPersonUpdeate } from './dto/dtoPersonUpdeate.dto';
import { FilmService } from 'src/film/film.service';
import { Film } from 'src/film/entity/film.entity';

const maxFavoriteMovie: number = 5;

@Injectable()
export class PersonService {
    constructor(
        @InjectRepository(Person) private readonly personRepository: Repository<Person>,
        private readonly filmService:FilmService,
    ) {}

    async getPerson():Promise<Person[]> {
        try{
            const criterio: FindManyOptions = {
                relations: ['favouriteMovies'],
                order:{
                    firstName: 'ASC',
                    lastName: 'ASC'
                }
            }
            const people:Person[] = await this.personRepository.find(criterio);
            if (!people || people.length === 0) throw new NotFoundException('there are no registered people');
            return people;
        } catch (error) {
           throw this.handleExceptions(error, `Error when trying to access the database`)
        }
    }

    async getPersonById(id:number):Promise<Person|null> {
        try{
            const criterio: FindOneOptions = {
                relations: ['favouriteMovies'],
                where: {id : id}
            }
            const person:Person | null = await this.personRepository.findOne(criterio);
            return person;
        } catch (error) {
           throw this.handleExceptions(error, `Error when trying to access the database`)
        }
    }

    async getPersonByName(name:string):Promise<Person[]> {
        try{
            const criterio: FindManyOptions = {
                relations: ['favouriteMovies'],
                where: {firstName : name}
            }
            const person:Person[] = await this.personRepository.find(criterio);
            return person;
        } catch (error) {
           throw this.handleExceptions(error, `Error when trying to access the database`)
        }
    }

    async createPerson(person:DtoPerson):Promise<Person> {
        try {
            const newPerson: Person = new Person(
                person.firstName,
                person.lastName,
                person.birtdate,
                person.hasInsurance
            )
            const personSave: Person = await this.personRepository.save(newPerson);
            return personSave;
        } catch (error) {
            throw this.handleExceptions(error, `Error create person data`)
        }
    }

    async updeatePerson(person:DtoPersonUpdeate, id:number):Promise<Person> {
        try {
            const personFound:Person|null = await this.getPersonById(id);            
            if (!personFound) throw new NotFoundException('There is no person with id: '+id);

            const newPerson: Person = {
                id,
                firstName: person.firstName || personFound.firstName,
                lastName: person.lastName || personFound.lastName,
                birtdate: person.birtdate || personFound.birtdate,
                hasInsurance: person.hasInsurance || personFound.hasInsurance,
                favouriteMovies:personFound.favouriteMovies
           }
            const personSave: Person = await this.personRepository.save(newPerson);
            return personSave;
        } catch (error) {
            throw this.handleExceptions(error, `Error updeate person data`)
        }
    }

    async deletePerson(id:number):Promise<boolean> {
        try {
            const personFound:Person |null= await this.getPersonById(id);
            if (!personFound) throw new NotFoundException('There is no person with id: '+id);
            await this.personRepository.remove(personFound);
            return true;
        } catch (error) {
            throw this.handleExceptions(error, `Error deleted person data`);
        }
    }

    async addMovie(id:number, movie:Film){
        try {
            let film: Film;
            const person: Person | null = await this.getPersonById(id);
            if (!person) throw new NotFoundException('There is no person with id: '+id);
            if (person.favouriteMovies.length>=maxFavoriteMovie) throw new NotFoundException("You have reached the maximum number of favorite movies, you cannot add more.")
            
            if (!movie.id) {
                film= await this.filmService.createFilm(movie);
            } else {
                const filmFound = await this.filmService.getFilmById(movie.id);
                if (!filmFound) throw new NotFoundException('There is no film with id: '+movie.id);
                film=filmFound;
            }    
            
            if (person.favouriteMovies.some(filmFav => filmFav.id===film.id)) throw new NotFoundException("The movie had already been added to favorites previously")
            
            person.favouriteMovies.push(film);
            const personSave: Person = await this.personRepository.save(person);

            return personSave;

        } catch (error) {
            throw this.handleExceptions(error, `Could not add movie to favorites`);
            
        }
    }

    async subtractMovie(id:number, movie:Film): Promise <Person> {
        try {
            const person: Person | null = await this.getPersonById(id);
            if (!person) throw new NotFoundException('There is no person with id: '+id);
            if (!movie.id) throw new NotFoundException('The movie has no ID');
            if (!person.favouriteMovies.some(favMovie => favMovie.id === movie.id))throw new NotFoundException("the movie is not in the favorites list")          
            
            const filmList:Film[] = person.favouriteMovies.filter(favMovie => favMovie.id != movie.id);
            person.favouriteMovies=filmList;
            const personSave: Person = await this.personRepository.save(person);

            return personSave;

        } catch (error) {
            throw this.handleExceptions(error, `Could not subtract movie to favorites`);
            
        }
    }

    private handleExceptions(error: any, customMessage: string): never {
        if (error instanceof HttpException) {
            throw error;
        } else if (error instanceof ConflictException) {
            throw new HttpException({ status: HttpStatus.CONFLICT, error: error.message }, HttpStatus.CONFLICT);
        } else {
            throw new HttpException({ status: HttpStatus.INTERNAL_SERVER_ERROR, error: `${customMessage}: ${error}` }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
