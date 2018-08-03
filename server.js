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

app.get('/blog-posts', (req, res) => {
	res.json(BlogPosts.get());
});

app.post('/blog-posts', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}

	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
	res.status(201).json(item);
});


app.put('/blog-posts/:id', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if(!(field in req.body)) {
			const message = `Missing ${field} in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}

	if (req.params.id !== req.body.id) {
		const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must watch`;
		console.error(message);
		return res.status(400).send(message);
	}

	console.log(`Updating Blog Post ${req.params.id}`);
	BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	});
	res.status(204).end();

});

app.delete('/blog-posts/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blog post ${req.params.ID}`);
	res.status(204).end();
});

app.get('/blog-posts', (req, res) => {
	res.json(BlogPosts.get());
});

app.post('/blog-posts', (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for(let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing ${field} in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author)
});

app.delete('/blog-posts/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blog posts ${req.params.ID}`);
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
