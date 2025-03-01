import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { PersonService } from './person.service';
import { Person } from './entity/person.entity';
import { DtoPerson } from './dto/dtoPerson.dto';
import { DtoPersonUpdeate } from './dto/dtoPersonUpdeate.dto';
import { Film } from 'src/film/entity/film.entity';

@Controller('person')
export class PersonController {
    constructor(private readonly personService: PersonService) {}

    @Get()
    @HttpCode(200)
    async getPerson(): Promise<Person[]> {
        return this.personService.getPerson();
    }

    @Get(':id')
    @HttpCode(200)
    async getPersonById(
        @Param('id') id: string
    ): Promise<Person | Person[]> {
        const idNumber = !isNaN(Number(id));
        if (idNumber) {
            const person: Person | null = await this.personService.getPersonById(Number(id));
            if (!person) throw new NotFoundException('There is no person with id: '+idNumber);
            return person
        } else {
            const personName: Person[]= await this.personService.getPersonByName(id);
        if (!personName || personName.length <=0 ) throw new NotFoundException('There is no person with name: '+id);

        return personName
        }

    }

    @Get(':name')
    @HttpCode(200)
    async getPersonByName(
        @Param('name', new ParseIntPipe(
            { errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }
        )) name: string
    ): Promise<Person[]> {
           
        const person: Person[]= await this.personService.getPersonByName(name);
        if (!person || person.length <=0 ) throw new NotFoundException('There is no person with name: '+name);

        return person
    }

    @Post()
    @HttpCode(201)
    async createPerson(
        @Body() date: DtoPerson
    ): Promise<Person> {
           
        return this.personService.createPerson(date);
    }

    @Patch(':id')
    @HttpCode(200)
    async updeatePerson(
        @Param('id', new ParseIntPipe(
            { errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }
        )) id: number,
        @Body() date: DtoPersonUpdeate
    ): Promise<Person> {
           
        return this.personService.updeatePerson(date, id);
    }

    @Delete(':id')
    @HttpCode(200)
    async deletePerson(
        @Param('id', new ParseIntPipe(
            { errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }
        )) id: number
    ): Promise<boolean> {
        return this.personService.deletePerson(id);
    }

    @Patch('addMovie/:id')
    @HttpCode(200)
    async addFilmFavorite(
        @Param('id', new ParseIntPipe(
            { errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }
        )) id: number,
        @Body() date: Film
    ): Promise<Person> {
        return this.personService.addMovie(id, date);
        
    }

    @Patch('subtractMovie/:id')
    @HttpCode(200)
    async subtractFilmFavorite(
        @Param('id', new ParseIntPipe(
            { errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }
        )) id: number,
        @Body() date: Film
    ): Promise<Person> {
        return this.personService.subtractMovie(id, date);
        
    }
}
