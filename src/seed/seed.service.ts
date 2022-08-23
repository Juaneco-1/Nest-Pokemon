import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from '../common/adapters/axios.adapter';


@Injectable()
export class SeedService {
  

  

  constructor (
  
    @InjectModel (Pokemon.name)
  private readonly pokemonModel:Model<Pokemon>,

  private readonly http:AxiosAdapter){

  }

  async executeSeed(){
    
    const data= await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=15');

    await this.pokemonModel.deleteMany();//Borra todo lo que hay en el repo o base de datos
    const pokemonToInsert:{name:string,no:number}[]=[];
    data.results.forEach(async ({name,url})=>{
      
      const segments=url.split('/');
      const no=+segments[segments.length-2];

      console.log({name,no});

      //const pokemon = await this.pokemonModel.create({no,name});
      pokemonToInsert.push({name,no});

    })
    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed Executed';

  }

}
