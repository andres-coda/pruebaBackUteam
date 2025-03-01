import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DtoFilmUpdeate {

    @IsNotEmpty()
    @IsString()
    title:string;

    @IsNotEmpty()
    @IsString()
    genre:string;
}