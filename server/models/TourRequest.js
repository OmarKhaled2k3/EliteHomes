const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    propertyId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    propertyTitle:{ type: String },
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, trim: true, lowercase: true },
    phone:        { type: String, required: true, trim: true },
    preferredDate:{ type: String, required: true },
    message:      { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TourRequest', tourSchema);
