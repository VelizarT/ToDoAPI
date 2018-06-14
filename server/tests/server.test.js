const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

//beforeEach executes before every test; make sure there are no items in the collection
beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('PATCH /todos/:id', () => {

    it('should update the todo', (done) => {
        var idToUpdate = todos[0]._id.toHexString();
        var body = {text: 'New test todo', completed: true};
        request(app)
            .patch(`/todos/${idToUpdate}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(body.text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeTruthy();
            }).end(done);
    });

    it('should clear completed at when todo is not completed', (done) => {
        var idToUpdate = todos[1]._id.toHexString();
        var body = {text: 'New test todo', completed: false};
        request(app)
            .patch(`/todos/${idToUpdate}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(body.text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
            }).end(done);
    });
    
});

describe('Get /users/me', () => {
    
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            }).end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        var fakeToken = '23r2gfw4ge';
        request(app)
            .get('/users/me')
            .set('x-auth', fakeToken)
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
            
    });
});

describe('POST /users', () => {

    it('should create a user', (done) => {
        var email = 'example@example.com';
        var password = 'somepass';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            }).end((err) => {
                if(err) {
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password); //check hashing
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

    it('should return validation error if request invalid', (done) => {
        request(app)
            .post('/users')
            .send({
                email: 'and',
                password: '1'
            })
            .expect(400)
            .end(done);
    });

    it('should not create a user if email in use', (done) => {
        var email = users[0].email;
        var password = 'somepass';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    
    it('sould login user and return auth token', (done) => {
        var email = users[1].email;
        var password = users[1].password;

        request(app)
            .post('/users/login')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toMatchObject({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

    it('sould return 400 if email or password are incorrect', (done) => {
        var email = users[1].email;
        var password = 'someOtherPassword';

        request(app)
            .post('/users/login')
            .send({email, password})
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });
});

describe('DELETE /users/me/token', () => {

    it('should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((err) => done(err));
            });
    });

});