const models = require('../models');
const _ = require('lodash');
const Moment = require('moment');

let premium = true;

const Domo = models.Domo;

const daysPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('days', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const graphsPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('graphs', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both date and calories are required' });
  }

  console.log(req.body.name);

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    sugar: req.body.sugar,
    fat: req.body.fat,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return domoPromise;
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ domos: docs });
  });
};

const getDays = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    console.log(premium);
    let dates = [];
    for (let x = 0; x < docs.length; x++) {
      let alreadyIn = false;
      const entry = {
        name: '',
        calories: 0,
        sugar: 0,
        fat: 0,
      };
      for (let y = 0; y < dates.length; y++) {
        if (docs[x].name === dates[y].name) {
          alreadyIn = true;
          break;
        }
      }
      if (!alreadyIn) {
        entry.name = docs[x].name;
        entry.calories = 0;
        entry.sugar = 0;
        entry.fat = 0;
        dates.push(entry);
      }
    }
    dates = _.orderBy(dates, (o) => new Moment(o.name));
    for (let a = 0; a < docs.length; a++) {
      for (let b = 0; b < dates.length; b++) {
        if (dates[b].name === docs[a].name) {
          if (docs[a].age) {
            dates[b].calories += docs[a].age;
          }
          if (docs[a].sugar && premium) {
            dates[b].sugar += docs[a].sugar;
          }
          if (docs[a].fat && premium) {
            dates[b].fat += docs[a].fat;
          }
        }
      }
    }
    return res.json({ dates });
  });
};

const setPremium = (request, response) => {
  console.log(`b: ${premium}`);
  premium = !premium;
  console.log(`a: ${premium}`);
  return response.json({ premium });
};

const getPremium = (request, response) => response.json({ premium });

module.exports.makerPage = makerPage;
module.exports.daysPage = daysPage;
module.exports.graphMaker = graphsPage;
module.exports.getDomos = getDomos;
module.exports.getDays = getDays;
module.exports.make = makeDomo;
module.exports.premium = setPremium;
module.exports.getPremium = getPremium;
