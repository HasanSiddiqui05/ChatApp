import mongoose from 'mongoose'

const connectDB = async ()=> {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MogoDB Connected');
    }catch(err){
        console.log('DB connection failed', err.message);
    }
}

export default connectDB