const mongoose    = require('mongoose')

// create mongoose schema
const resolution = new mongoose.Schema({
    signature: String,
    title: {type: String, required: true, es_indexed: true},
    text: {type: String, required: true, es_indexed: true},
    chamber: String,
    keys: [String],
    applicant: String,
    result: {type: String, default: "Pending"},
    date: {type: Date, default: Date.now},
    meta: {
      created_at: {type: Date, default: Date.now},
      created_by: String
    }
  })

module.exports = resolution
  