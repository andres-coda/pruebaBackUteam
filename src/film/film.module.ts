import { forwardRef, Module } from '@nestjs/common';
import { FilmController } from './film.controller';
import { FilmService } from './film.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from 'src/person/entity/person.entity';
import { Film } from './entity/film.entity';
import { PersonModule } from 'src/person/person.module';

@Module({
  imports:[TypeOrmModule.forFeature([Person, Film]),
  forwardRef(()=>PersonModule),
],
  controllers: [FilmController],
  providers: [FilmService],
  exports: [FilmService]
})
export class FilmModule {}
