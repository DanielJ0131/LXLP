import mongoose, {Schema} from 'mongoose'

const blacklistedTokenSchema = new Schema({
  token: { 
    type: String, 
    required: true, 
    unique: true 
  },
  user: {
    sub: { type: String, required: true },  
    username: { type: String, required: true },  
    email: { type: String, required: true },
    role: { type: String, required: true }, 
  },
  permissions: [{ type: String }], 
  issuedAt: { type: Date, required: true },
  expiresAt: { 
    type: Date, 
    required: true,
    index: { expires: 0 } 
  },
  reason: { 
    type: String,
    enum: ['logout', 'security', 'other'],
    default: 'logout'
  },
  blacklistedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('BlacklistedToken', blacklistedTokenSchema);