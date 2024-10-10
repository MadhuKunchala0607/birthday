import mongoose from 'mongoose';

const birthdaySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: Date, required: true },
});

// Ensure you are exporting the model correctly
const Birthday = mongoose.model('Birthday', birthdaySchema);
export default Birthday;
