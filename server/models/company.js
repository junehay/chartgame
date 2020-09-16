module.exports = (sequelize, DataTypes) => {
    return sequelize.define('company', { 
        code: {
            type: DataTypes.STRING(30), // VARCHAR
            allowNULL: false
        },
        name: {
            type: DataTypes.STRING(30),
            allowNULL: false
        },
        trading_date: {
            type: DataTypes.DATE, 
            allowNULL: true,
        },
        end_price: {
            type: DataTypes.INTEGER,
            allowNULL: false
        },
        start_price: {
            type: DataTypes.INTEGER,
            allowNULL: false
        },
        high_price: {
            type: DataTypes.INTEGER,
            allowNULL: false
        },
        low_price: {
            type: DataTypes.INTEGER,
            allowNULL: false
        },
        volume: {
            type: DataTypes.INTEGER,
            allowNULL: false
        },
        use_yn: {
            type: DataTypes.STRING(10),
            allowNULL: false,
            defaultValue: 'Y'
        },
    },{
        timestamps: true, // ture일 시 시퀄라이저는 createAt, updateAt 컬럼을 추가함.
    })
}