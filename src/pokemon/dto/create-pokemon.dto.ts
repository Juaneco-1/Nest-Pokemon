import { IsInt, IsPositive, IsString, Min, min, Length } from "class-validator";


export class CreatePokemonDto {


    
    @IsInt()
    @IsPositive()
    @Min(1)
    no:number;

    @IsString()
    @Length(1)
    name:string;


}
