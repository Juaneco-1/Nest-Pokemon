
import { BadRequestException, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { NotFoundError } from 'rxjs';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from '../common/dto/pagination.dto';


export class PokemonService {

  constructor ( @InjectModel (Pokemon.name) private readonly pokemonModel:Model<Pokemon>){

  }


  async   create(createPokemonDto: CreatePokemonDto) {

    createPokemonDto.name=createPokemonDto.name.toLowerCase(); 

    try {
      
      const Pokemon= await this.pokemonModel.create(createPokemonDto);
      return Pokemon;
    } catch (error) {
        this.handleExeptions(error);
    }
  }

  findAll(queryParameters:PaginationDto ) {
    
    const { limit=10,offset=0 }= queryParameters;
    
    return this.pokemonModel.find().
    limit(limit).
    skip(offset).
    select('-__V')//Quitar la columna de --V de la base de datos
    ;
  }

  async findOne(term: string) {

    let pokemon:Pokemon;

    if(!isNaN(+term)){
      pokemon=await this.pokemonModel.findOne({ no : term });
    }


    //MongoId

    if(!pokemon && isValidObjectId(term)){
      pokemon=await this.pokemonModel.findById(term);
    }

    //Name
    if(!pokemon){
      pokemon=await this.pokemonModel.findOne({ name : term.toLowerCase() });
    }

    if(!pokemon) throw new NotFoundException(`Pokemon with id ${term} not found`);
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    
    const pokemon= await this.findOne(term);
    if(updatePokemonDto.name){
      updatePokemonDto.name=updatePokemonDto.name.toLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto,{new:true});  
      return {...pokemon.toJSON(),...updatePokemonDto};
    } catch (error) {
      this.handleExeptions(error);
    }
      
    

    
  }
  async remove(term: string) {
    
    /* const pokemonToDelete=await this.findOne(term);
    
    await pokemonToDelete.deleteOne(); */

    const { deletedCount } = await this.pokemonModel.deleteOne({_id:term});

    if(deletedCount===0){
      throw new NotFoundException(`Pokemon with id ${term} not found`);
    }
    return;

  }

  private handleExeptions(error:any){
    if(error.code===11000){
      throw new BadRequestException(`Pokemon already exist in db ${JSON.stringify(error.keyValue)}`) ;
   }
   else{
     throw new InternalServerErrorException(`Cant create Pokemon`);
   }
  }
}
