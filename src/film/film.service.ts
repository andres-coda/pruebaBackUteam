import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Film } from './entity/film.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { DtoFilm } from './dto/dtoFilm.dto';
import { DtoFilmUpdeate } from './dto/dtoFilmUpdeate.dto';

@Injectable()
export class FilmService {
    constructor(
        @InjectRepository(Film) private readonly filmRepository: Repository<Film>,
    ) {}

    async getFilm():Promise<Film[]> {
            try{
                const criterio: FindManyOptions = {
                }
                const films:Film[] = await this.filmRepository.find(criterio);
                if (!films || films.length === 0) throw new NotFoundException('there are no registered films');
                return films;
            } catch (error) {
               throw this.handleExceptions(error, "Error when trying to access the database")
            }
        }
    
        async getFilmById(id:number):Promise<Film|null> {
            try{
                const criterio: FindOneOptions = {
                    where: {id : id}
                }
                const film:Film | null = await this.filmRepository.findOne(criterio);
                return film;
            } catch (error) {
               throw this.handleExceptions(error, "Error when trying to access the database")
            }
        }
    
        async getFilmByName(name:string):Promise<Film[]> {
            try{
                const criterio: FindManyOptions = {
                    where: {title : name}
                }
                const film:Film[] = await this.filmRepository.find(criterio);
                return film;
            } catch (error) {
               throw this.handleExceptions(error, "Error when trying to access the database")
            }
        }
    
        async createFilm(film:DtoFilm):Promise<Film> {
            try {
                const newFilm: Film = new Film(
                    film.title,
                    film.genre
                )
                const filmSave: Film = await this.filmRepository.save(newFilm);
                return filmSave;
            } catch (error) {
                throw this.handleExceptions(error, "Error create film data")
            }
        }
    
        async updeateFilm(film:DtoFilmUpdeate, id:number):Promise<Film> {
            try {
                const filmFound:Film|null = await this.getFilmById(id);            
                if (!filmFound) throw new NotFoundException('There is no film with id: '+id);
    
                const newFilm: Film = {
                    id,
                    title: film.title || filmFound.title,
                    genre: film.genre || filmFound.genre,
                    favouritePerson: filmFound.favouritePerson
               }
                const filmSave: Film = await this.filmRepository.save(newFilm);
                return filmSave;
            } catch (error) {
                throw this.handleExceptions(error, "Error updeate film data")
            }
        }
    
        async deleteFilm(id:number):Promise<boolean> {
            try {
                const filmFound:Film |null= await this.getFilmById(id);
                if (!filmFound) throw new NotFoundException('There is no film with id: '+id);
                await this.filmRepository.remove(filmFound);
                return true;
            } catch (error) {
                throw this.handleExceptions(error, 'Error deleted film data')
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
