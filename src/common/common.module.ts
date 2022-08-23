import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';

@Module({

    providers:[AxiosAdapter],
    exports:[AxiosAdapter]//Debe ser visible fuera de este modulo
})
export class CommonModule {}
