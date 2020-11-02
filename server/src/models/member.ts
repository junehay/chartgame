import { Table, Column, Model, AllowNull, DataType, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table
export class Member extends Model<Member> {
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
  member_id?: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100)
  })
  member_pwd?: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}

// import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

// export interface MemberAttributes {
//   member_id: string;
//   member_pwd: string;
//   createdAt?: Date;
//   updatedAt?: Date;
// }
// export interface MemberModel extends Model<MemberAttributes>, MemberAttributes {}
// export class Member extends Model<MemberModel, MemberAttributes> {}

// export type MemberStatic = typeof Model & {
//   new (values?: Record<string, unknown>, options?: BuildOptions): MemberModel;
// };

// export function MemberFactory(sequelize: Sequelize): MemberStatic {
//   return <MemberStatic>sequelize.define('member', {
//     member_id: {
//       type: DataTypes.STRING(30),
//       allowNull: false
//     },
//     member_pwd: {
//       type: DataTypes.STRING(100),
//       allowNull: false
//     },
//     createdAt: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       defaultValue: DataTypes.NOW
//     },
//     updatedAt: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       defaultValue: DataTypes.NOW
//     }
//   });
// }
