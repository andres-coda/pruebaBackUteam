import { Controller, Get, Post, Patch, Delete, HttpCode, Param, Body, ParseIntPipe, HttpStatus, NotFoundException } from '@nestjs/common';
import { FilmService } from './film.service';
import { Film } from './entity/film.entity';
import { DtoFilm } from './dto/dtoFilm.dto';
import { DtoFilmUpdeate } from './dto/dtoFilmUpdeate.dto';

@Controller('film')
export class FilmController {
    constructor(private readonly filmService: FilmService) {}

    @Get()
    @HttpCode(200)
    async getFilm(): Promise<Film[]> {
        return this.filmService.getFilm();
    }

    @Get(':id')
    @HttpCode(200)
    async getFilmById(
        @Param('id', new ParseIntPipe(
            { errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }
        )) id: number
    ): Promise<Film> {
           
        const film: Film | null = await this.filmService.getFilmById(id);
        if (!film) throw new NotFoundException('There is no film with id: '+id);

        return film
    }

    @Post()
    @HttpCode(201)
    async createFilm(
        @Body() date: DtoFilm
    ): Promise<Film> {
           
        return this.filmService.createFilm(date);
    }

    @Patch(':id')
    @HttpCode(200)
    async updeateFilm(
        @Param('id', new ParseIntPipe(
            { errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }
        )) id: number,
        @Body() date: DtoFilmUpdeate
    ): Promise<Film> {
        return this.filmService.updeateFilm(date, id);
    }

    @Delete(':id')
    @HttpCode(200)
    async deleteFilm(
        @Param('id', new ParseIntPipe(
            { errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }
        )) id: number
    ): Promise<boolean> {
        return this.filmService.deleteFilm(id);
    }
}

