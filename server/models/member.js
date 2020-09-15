module.exports = (sequelize, DataTypes) => {
    return sequelize.define('member', { 
        member_id: {
            type: DataTypes.STRING(30),
            allowNULL: false
        },
        member_pwd: {
            type: DataTypes.STRING(100),
            allowNULL: false
        }
    },{
        timestamps: true, // ture일 시 시퀄라이저는 createAt, updateAt 컬럼을 추가함.
    })
}