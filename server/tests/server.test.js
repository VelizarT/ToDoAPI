const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');

//Some default, predictable data:
const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo'
}, {
    _id: new ObjectID(),
    text: 'Third test todo'
}];

//beforeEach executes before every test; make sure there are no items in the collection
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST todos: ', () => {

    it('should create a new todo', (done) => {
        var text = 'test to do text';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => done(err)); 
            });
    });

    it('should not create todo with invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

});

describe('GET /todos', () => {

    it('should fetch all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(3);
            }).end(done);
    });

});

describe('GET /todos/:id', () => {

    it('should fetch todo with id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => { //custom expect call
                expect(res.body.todo.text).toBe(todos[0].text);
            }).end(done);
    });

    it('should return 404 if todo not found', (done) => {
        var idNotInColection = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${idNotInColection}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if id not valid', (done) => {
        var notValidId = '52334';
        request(app)
            .get(`/todos/${notValidId}`)
            .expect(404)
            .end(done);
    });

});

describe('DELETE /todos/:id', () => {

    it('should delete todo with id', (done) => {
        var idToDelete = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${idToDelete}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(idToDelete);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.findById(idToDelete).then((todo) => {
                    expect(todo).toBeFalsy();
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

    it('should return 404 if todo not found', (done) => {
        var idNotInColection = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${idNotInColection}`)
            .expect(404)
            .end(done);
    });
    
    it('should return 404 if id not valid', (done) => {
        var idNotValid = '23534';
        request(app)
            .delete(`/todos/${idNotValid}`)
            .expect(404)
            .end(done);
    });


});