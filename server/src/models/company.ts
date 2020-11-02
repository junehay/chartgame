import { Table, Column, Model, AllowNull, DataType, CreatedAt, UpdatedAt, PrimaryKey, Default, AutoIncrement } from 'sequelize-typescript';

@Table
export class Company extends Model<Company> {
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
  code!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(30)
  })
  name!: string;

  @AllowNull(false)
  @Column({
    type: DataType.DATE
  })
  trading_date!: string;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER
  })
  end_price!: number;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER
  })
  start_price!: number;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER
  })
  high_price!: number;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER
  })
  low_price!: number;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER
  })
  volume!: number;

  @Default('Y')
  @AllowNull(false)
  @Column({
    type: DataType.STRING(10)
  })
  use_yn!: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
