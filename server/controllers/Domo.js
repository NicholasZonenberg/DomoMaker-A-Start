const models = require('../models');
const _ = require('lodash');
const moment = require('moment');

var premium = true;

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
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
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
      return res.status(400).json({error:"An error occurred"});
    }
    return res.json({domos: docs});
  })
} 

const getDays = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if ( err) {
      console.log(err);
      return res.status(400).json({error:"An error occurred"});
    }
    console.log(premium);
    var dates=[];
    for(var x = 0; x < docs.length; x++){
      var alreadyIn = false;
      var entry = {
        name: "",
        calories: 0,
        sugar: 0,
        fat: 0,
      };
      for(var y = 0; y < dates.length; y++){
        if(docs[x].name === dates[y].name){
          alreadyIn = true;
          break;
        }
      }
      if (!alreadyIn){
        entry.name = docs[x].name;
        entry.calories = 0;
        entry.sugar = 0;
        entry.fat = 0;
        dates.push(entry);
      }
    }
    dates = _.orderBy(dates,function(o){
      return new moment(o.name);
    });
    for(var x = 0; x < docs.length; x++){
      for(var y = 0; y < dates.length; y++){
        if(dates[y].name === docs[x].name){
          if(docs[x].age){
            dates[y].calories += docs[x].age;
          }
          if(docs[x].sugar && premium){
            dates[y].sugar += docs[x].sugar;
          }
          if(docs[x].fat && premium){
            dates[y].fat += docs[x].fat;
          }
        }
      }
    }
    return res.json({dates: dates});
  })
}

const setPremium = (request, response) => {
  console.log("b: " + premium);
  premium = !premium;
  console.log("a: " + premium);
  return response.json({premium: premium});
}

const getPremium = (request, response) => {
  return response.json({premium: premium});
}

module.exports.makerPage = makerPage;
module.exports.daysPage = daysPage;
module.exports.getDomos = getDomos;
module.exports.getDays = getDays;
module.exports.make = makeDomo;
module.exports.premium = setPremium;
module.exports.getPremium = getPremium
