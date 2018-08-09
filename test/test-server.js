const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, closeServer, runServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);


describe('Blogs', function() {
  // Before our tests run, we activate the server. Our `runServer`
  // function returns a promise, and we return the promise by
  // doing `return runServer`. If we didn't return a promise here,
  // there's a possibility of a race condition where our tests start
  // running before our server has started.
  before(function() {
    return runServer();
  });

  after(function() {
  	return closeServer();
  });

  it("shoul list items on GET", function(){
  	return chai
  	.request(app)
  	.get("/blog-posts")
  	.then(function(res){
  		expect(res).to.have.status(200);
  		expect(res).to.be.json;
  		expect(res.body).to.be.a("aaray");
  		expect(res.body.length).to.be.at.least(1);

  		const expectedKeys = ["id", "title", "content", "author"];
 		res.body.forEach(function(item){
 			expect(item).to.be.a("object");
 			expect(item).to.include.keys(expectedKeys);
 		}); 		
  	});
  });

  it("should add an item on POST", function(){
  	const newBlog = {title: "Boring Blog", author: "Jane Doe"};
  	return chai
  		.request(app)
  		.post("blog-posts")
  		.send(newBlog)
  		.then(function(res) {
  			expect(res).to.have.status(201);
  			expect(res).to.be.json;
  			expect(res.body).to.be.a("object");
  			expect(res.body).to.include.keys("id", "title", "content", "author");
  			expect(res.body.id).to.not.equal(null);

  			expect(res.body).to.deep.equal(
  				Object.assign(newBlog, { id: res.body.id })
  				)
  		});
  });

  it("should update items on PUT", function(){
  	const updateData = {
  		title: "Very intresting blog",
  		author: "John Doe"
  	};

  	return (
  	chai	
  		.request(app)
  		.get("/blog-posts")
  		.then(function(res) {
  			updateData.id = res.body[0].id;

		return chai
		.request(app)
		.put(`/blog-posts/${updateData.id}`)
		.send(updateData);
  		})

  		.then(function(res) {
  			expect(res).to.have.status(200);
  			expect(res).to.be.json;
  			expect(res.body).to.be.a("object");
  			expect(res.body).to.deep.equal(updateData);
  		})
  	);

  });

  it("should delete items on DELETE", function() {
  	return (
  		chai
  		.request(app)
  		.get("/blog-posts")
  		.then(function(res) {
  			return chai.request(app).delete(`/blog-posts/${res.body[0].id}`)
  		})
  		.then(function(res) {
  			expect(res).to.have.status(204);
  		})
  	);
  });
});