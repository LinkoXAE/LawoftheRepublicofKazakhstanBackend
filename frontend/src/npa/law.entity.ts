import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Law {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  npa_type: string;

  @Column()
  article_number: string;

  @Column('text')
  content: string; 
  @Column()
  publication_date: string;
}