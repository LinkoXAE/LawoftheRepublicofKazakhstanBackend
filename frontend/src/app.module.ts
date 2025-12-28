import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Law } from './npa/law.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite', 
      entities: [Law],         
      synchronize: true,       
    }),
    TypeOrmModule.forFeature([Law]) 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}