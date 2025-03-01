import { IsEmpty, IsNumber, IsString } from "class-validator";

export class DtoFilm {

    @IsEmpty()
    @IsString()
    title:string;

    @IsEmpty()
    @IsString()
    genre:string;
}