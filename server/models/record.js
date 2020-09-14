module.exports = (sequelize, DataTypes) => {
    return sequelize.define('record', { 
        name: {
            type: DataTypes.STRING(30), // VARCHAR
            allowNULL: false
        },
        company: {
            type: DataTypes.STRING(30),
            allowNULL: false
        },
        vic_percent: {
            type: DataTypes.FLOAT,
            allowNULL: false
        },
        gain_percent: {
            type: DataTypes.FLOAT, 
            allowNULL: true,
        },
        account: {
            type: DataTypes.INTEGER,
            allowNULL: false
        }
    },{
        timestamps: true, // ture일 시 시퀄라이저는 createAt, updateAt 컬럼을 추가함.
    })
}