const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {BlogPosts} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

app.use(morgan('common'));

BlogPosts.create('Cool Tech', 'blah blah blah blah blah', 'Eugene S', 'Aug 3 1989');
BlogPosts.create('Cool Tech 2', 'blah blah blah blah blah', 'Eugene S', 'Aug 4 1989');
BlogPosts.create('Cool Tech 3', 'blah blah blah blah blah', 'Eugene S', 'Aug 5 1989');

