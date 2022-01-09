const mongoose = require("mongoose");
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  created_at: {
    type: String,
    default: new Date(),
  },
  updated_at: {
    type: String,
    default: new Date(),
  },
});

userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10)
    const hassPassword = await bcrypt.hash(this.password, salt)
    this.password = hassPassword
    next()
  } catch (error) {
    next(error)
  }
})

const user = mongoose.model('user', userSchema)
module.exports = user