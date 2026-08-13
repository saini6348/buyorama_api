import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Bank } from '../entities/bank.entity';
import { Tag } from '../entities/tag.entity';
import { CreditCardCategory } from '../entities/credit-card-category.entity';

@Entity('cards_feeds')
@Index(['bankId'])
export class CardsFeed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  image: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  link: string;

  @Column({ type: 'uuid', nullable: true })
  bankId: string;

  @Column({ type: 'smallint', default: 1 })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Bank, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'bankId' })
  bank: Bank;

  @ManyToMany(() => CreditCardCategory, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'cards_feeds_categories',
    joinColumn: { name: 'cardsFeedsId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'creditCardCategoryId', referencedColumnName: 'id' },
  })
  creditCardCategories: CreditCardCategory[];

  @ManyToMany(() => Tag, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'cards_feeds_tags',
    joinColumn: { name: 'cardsFeedsId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: Tag[];
}
