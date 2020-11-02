import { Table, Column, Model, AllowNull, DataType, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table
export class Rank extends Model<Rank> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER
  })
  id!: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(30)
  })
  name!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(30)
  })
  company!: string;

  @AllowNull(false)
  @Column({
    type: DataType.FLOAT
  })
  vic_percent!: number;

  @AllowNull(false)
  @Column({
    type: DataType.FLOAT
  })
  gain_percent!: number;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER
  })
  account!: number;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
