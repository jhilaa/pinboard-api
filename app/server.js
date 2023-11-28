const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const passport = require('passport')
const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy

require('dotenv').config();

app.use(express.urlencoded({extended: false}))
// Middleware
app.use(express.json());
app.use(cors());


//https://medium.com/@prashantramnyc/node-js-with-passport-authentication-simplified-76ca65ee91e5
app.use(session({
  secret: "secret",
  resave: false ,
  saveUninitialized: true ,
}))
// This is the basic express session({..}) initialization.
app.use(passport.initialize())
// init passport on every route call.
app.use(passport.session())
// allow passport to use "express-session".

authUser = (user, password, done) => {
//Search the user, password in the DB to authenticate the user
//Let's assume that a search within your DB returned the username and password match for "Kyle".
  let authenticated_user = { id: 123, name: "Kyle"}
  return done (null, authenticated_user )
}

passport.use(new LocalStrategy (authUser));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // '*' for the 1st tests.
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

passport.serializeUser( (userObj, done) => {
  done(null, userObj)
})

passport.deserializeUser((userObj, done) => {
  done (null, userObj )
})

checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  res.redirect("/login")
}

checkLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard")
  }
  next()
}

const apiKey = process.env.API_TOKEN;
const baseUrl = process.env.API_URL ;
const config = {
  headers: {
    'Authorization': `Bearer ${apiKey}`,
  },
};

app.get("/dashboard", checkAuthenticated, (req, res) => {
  res.render("dashboard.ejs", {name: req.user.id})
  console.log ("== dashboard ============");
})

app.get("/login", (req, res) => {
  res.render("login.ejs");
  console.log ("== login ============");

})

app.post ("/login", passport.authenticate('local', {
  successRedirect: "/dashboard",
  failureRedirect: "/login",
}))

app.delete("/logout", (req,res) => {
  req.logOut()
  res.redirect("/login")
  console.log(`-------> User Logged out`)
})

app.get('/api/pin/all',  cors (), async (req, res) => {
  console.log ("-- /api/pin/all -------")
  try {
    // Make an HTTP GET request to the back-end
    const response = await axios.get(baseUrl+ "/pins", config);
    // Send the data as the response to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Error fetching data'}) ;
  }
});

app.get('/api/tag/all', cors (), async (req, res) => {
  console.log ("-- /api/tag/all -------")
  try {
    // Make an HTTP GET request to the back-end
    const response = await axios.get(baseUrl+ "/tags", config);

    // Send the data as the response to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Error fetching data'});
  }
});

app.get('/api/domain/all', cors (), async (req, res) => {
  try {
    console.log ("-- /api/domain/all -------")
    // Make an HTTP GET request to the back-end
    const response = await axios.get(baseUrl+ "/domains", config);

    // Send the data as the response to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Error fetching data'});
  }
});

app.get('/api/domain/:domain/pins',  cors (), async (req, res) => {
  try {
    const domainName = req.params.domain;
    // Make an HTTP GET request to the back-end
    const getUrl = baseUrl+ "/pins?filterByFormula=AND({domain}=\""+domainName+"\")";
    const response = await axios.get(getUrl, config);
    // Send the data as the response to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Error fetching data'});
  }
});

app.get('/api/domain/:domain/tags',  cors (), async (req, res) => {
  try {
    const domainName = req.params.domain;
    // Make an HTTP GET request to the back-end
    const getUrl =baseUrl+ "/tags?filterByFormula=AND({domain}=\""+domainName+"\")";
    const response = await axios.get(getUrl, config);
        // Send the data as the response to the client
        res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Error fetching data'});
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server live on port ${PORT}`);
});





