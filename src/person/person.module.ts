import { forwardRef, Module } from '@nestjs/common';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entity/person.entity';
import { Film } from 'src/film/entity/film.entity';
import { FilmModule } from 'src/film/film.module';

@Module({
  imports: [TypeOrmModule.forFeature([Person, Film]),
  forwardRef(()=> FilmModule)
],
  controllers: [PersonController],
  providers: [PersonService],
})
export class PersonModule {}
