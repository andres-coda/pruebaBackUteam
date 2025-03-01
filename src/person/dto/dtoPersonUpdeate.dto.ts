import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DtoPersonUpdeate {

    @IsNotEmpty()
    @IsString()
    firstName:string;

    @IsNotEmpty()
    @IsString()
    lastName:string;

    @IsNotEmpty()
    @IsDate()
    birtdate:Date;

    @IsNotEmpty()
    @IsBoolean()
    hasInsurance: boolean;
}