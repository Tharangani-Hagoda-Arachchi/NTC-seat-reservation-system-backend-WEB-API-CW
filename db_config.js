import mongoose from "mongoose";

const DBConnect = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL,);
        console.log('MongoDB connected')

    }catch(error)
    {
        console.log('MongoDB connecton error', error.message)
        process.exit(1)
    }
}

export default DBConnect;
