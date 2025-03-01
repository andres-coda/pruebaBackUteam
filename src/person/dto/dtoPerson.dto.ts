import { IsBoolean, IsDate, IsEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DtoPerson {

    @IsEmpty()
    @IsString()
    firstName:string;

    @IsEmpty()
    @IsString()
    lastName:string;

    @IsNotEmpty()
    @IsDate()
    birtdate:Date;

    @IsNotEmpty()
    @IsBoolean()
    hasInsurance: boolean;
}