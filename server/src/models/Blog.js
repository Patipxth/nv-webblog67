module.exports = (sequelize, DataTypes) => {
    const Blog = sequelize.define('Blog', {
        Name: DataTypes.STRING,         
        thumbnail: DataTypes.STRING,  
        pictures: DataTypes.STRING,      
        content: DataTypes.TEXT,         
        CPU: DataTypes.STRING,  
        Display: DataTypes.STRING,  
        System: DataTypes.STRING,      
        Memory: DataTypes.STRING,       
        Storage: DataTypes.STRING,      
        Size: DataTypes.STRING 

    });

    return Blog;
}


