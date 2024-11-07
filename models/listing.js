const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const Model = mongoose.model;

const imageSchema = new Schema({
  filename: {
    type: String,
    default: "listingimage",
  },
  url: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1729808085332-4a855b6f1b62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDF8RnpvM3p1T0hONnd8fGVufDB8fHx8fA%3D%3D",
  },
});

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: imageSchema,
    default: {}, // This ensures an image object is always created
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

// Pre-save middleware to ensure default image URL is set
listingSchema.pre("save", function (next) {
  if (!this.image.url) {
    this.image.url =
      "https://images.unsplash.com/photo-1729808085332-4a855b6f1b62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDF8RnpvM3p1T0hONnd8fGVufDB8fHx8fA%3D%3D";
  }
  next();
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = Model("Listing", listingSchema);

module.exports = Listing;
