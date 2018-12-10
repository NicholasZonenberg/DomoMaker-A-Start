const models = require('../models');
const _ = require('lodash');
const Moment = require('moment');

let premium = true;

const Domo = models.Domo;

var biking = 11;
var running = 9;
var swimming = 7;
var walking = 5;

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

const prem = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('premium', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const exercise = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('exercise', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const exGraph = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('exGraph', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const error = (req, res) => {
  return res.render('error');
}

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
  if (!req.body.name) {
    return res.status(400).json({ error: 'Both date and calories are required' });
  }

  console.log(req.body.name);

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    sugar: req.body.sugar,
    fat: req.body.fat,
    owner: req.session.account._id,
    exerciseTime: req.body.exerciseTime,
    exerciseType: req.body.exerciseType,
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
        caloriesBurn: 0,
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
        entry.caloriesBurn = 0;
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
          if (docs[a].exerciseTime && premium && docs[a].exerciseType == 'walking') {
            dates[b].caloriesBurn += docs[a].exerciseTime * walking;
          }
          if (docs[a].exerciseTime && premium && docs[a].exerciseType == 'running') {
            dates[b].caloriesBurn += docs[a].exerciseTime * running;
          }
          if (docs[a].exerciseTime && premium && docs[a].exerciseType == 'biking') {
            dates[b].caloriesBurn += docs[a].exerciseTime * biking;
          }
          if (docs[a].exerciseTime && premium && docs[a].exerciseType == 'swimming') {
            dates[b].caloriesBurn += docs[a].exerciseTime * swimming;
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
module.exports.prem = prem;
module.exports.exercise = exercise;
module.exports.exGraph = exGraph;
module.exports.error = error;