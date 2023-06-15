const request = require("supertest");
const path = require("path");
const app = require("../../../index");
const { faker } = require("@faker-js/faker");
jest.mock("../../helpers/nodemailer.js");
jest.mock("../../helpers/validation.js");

const dummyUserData = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    phone: "12215611891",
    gender: "Male",
    address: faker.string.alpha(),
    role: "admin",
};

describe('create a user', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });


    //   test('should create a new user', async () => {
    //     const newUserResponse = await request(app).post('/users').send(dummyUserData);
    //     console.log(dummyUserData);
    //     const newUser = newUserResponse.body.data;
    //     console.log("hjncfd", newUserResponse.body);

    //     expect(newUserResponse.statusCode).toEqual(201);
    //     expect(newUser.name).toBe(dummyUserData.name);
    //     expect(newUser.email).toBe(dummyUserData.email);
    //     expect(newUser.phone).toBe(dummyUserData.phone);
    //     expect(newUser.gender).toBe(dummyUserData.gender);
    //     expect(newUser.address).toBe(dummyUserData.address);
    //     expect(newUser.role).toBe(dummyUserData.role);
    //   }, 10000);

    test('should not create a new user', async () => {
        const newUserResponse = await request(app).post('/users').send(dummyUserData);
        console.log(dummyUserData);
        const newUser = newUserResponse.body.data;
        expect(newUserResponse.statusCode).toEqual(422);
    }, 10000);

    test('should create a new user(User already exists.)', async () => {
        const newUserResponse = await request(app).post('/users').send({ email:'test1@gmail.com'})
        const newUser = newUserResponse.body;
        console.log("newUser", newUser);
        expect(newUser.message).toMatch('PLease Provide Valid email');
        expect(newUser.statusCode).toEqual(422);
    });

});