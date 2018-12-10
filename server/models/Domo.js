const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let DomoModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    trim: true,
    set: setName,
  },

  age: {
    type: Number,
    min: 0,
    required: false,
  },

  sugar: {
    type: Number,
    min: 0,
    required: false,
  },

  fat: {
    type: Number,
    min: 0,
    required: false,
  },

  exerciseType: {
    type: String,
    required: false,
  },

  exerciseTime: {
    type: Number,
    required: false,
    min:0,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  sugar: doc.sugar,
  fat: doc.fat,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return DomoModel.find(search).select('name age fat sugar exerciseType exerciseTime').exec(callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
