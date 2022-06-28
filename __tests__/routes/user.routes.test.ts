import request from 'supertest';

import app from '../../src/app';
import prisma from '../../lib/prisma';

describe('User routes', () => {
	let userId: string;

	beforeAll(async () => {
		const randUser = await prisma.user.findMany();
		userId = randUser[0].id;
	});

	// ***************
	// Create a User *
	// ***************
	test('Create a new user', async () => {
		const randNum = Math.random() * 10000 + 1;
		const testUser = {
			email: `test${randNum}@test.com`,
			password: 'plaintexttest',
			type: 'CUSTOMER',
			profile: {
				firstName: 'Sam',
				lastName: 'OneEye',
				addressLine1: '245 secondary ave',
				city: 'Denton',
				state: 'MI',
				zip: '98745',
			},
		};

		// Send a POST request through the application.
		const appResponse = await request(app).post('/api/user').set('Content-Type', 'application/json').send(testUser);
		// What was the generated id for the new user?

		// Check the database for the new entry.
		const dbResponse = await prisma.user.findUnique({
			where: {
				email: testUser.email,
			},
			include: {
				profile: true,
			},
		});
		const dbResponseJson = JSON.parse(JSON.stringify(dbResponse));

		// Expect a valid status code from the server
		expect(appResponse.statusCode).toEqual(201);

		// Expect the app response to equal the original data
		expect(appResponse.body.email).toEqual(testUser.email);
		expect(appResponse.body.password).toEqual(testUser.password);
		expect(appResponse.body.type).toEqual(testUser.type);

		// Expect the db response to equal the original data
		expect(dbResponseJson.email).toEqual(testUser.email);
		expect(dbResponseJson.password).toEqual(testUser.password);
		expect(dbResponseJson.type).toEqual(testUser.type);

		// Expect the response from the app to match the response from the db
		expect(appResponse.body).toEqual(dbResponseJson);
	});

	// ****************
	// Read All Users *
	// ****************
	test('Read all users', async () => {
		// Get the response from the app
		const appResponse = await request(app).get('/api/user');

		// Get the response from the database
		const dbResponse = await prisma.user.findMany();
		const dbResponseJson = JSON.parse(JSON.stringify(dbResponse));

		// Expect a valid success code
		expect(appResponse.statusCode).toEqual(200);

		// Expect the result from the application matches the result from the database.
		expect(appResponse.body).toEqual(dbResponseJson);
	});

	// ***************
	// Read One User *
	// ***************
	test('Read a user by id', async () => {
		// Get application response
		const appResponse = await request(app).get(`/api/user/${userId}`);

		// Get db response
		const dbresponse = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		const dbResponseJson = JSON.parse(
			JSON.stringify(dbresponse, (key: string, value: any): any =>
				typeof value == 'bigint' ? value.toString() : value
			)
		);

		// Expect a valid success code
		expect(appResponse.statusCode).toEqual(200);

		// Expect the app and the database agree.
		expect(appResponse.body).toEqual(dbResponseJson);
	});

	// ***************
	// Update a User *
	// ***************
	test('Update user by id', async () => {
		const mod = {
			password: 'newplaintexttestpassword',
		};

		// Send the PUT request through the application
		const appResponse = await request(app).put(`/api/user/${userId}`).set('Content-Type', 'application/json').send(mod);

		// Get the db record after the modification
		const dbResponse = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			include: {
				profile: true,
			},
		});
		const dbResponseJson = JSON.parse(
			JSON.stringify(dbResponse, (key: string, value: any): any =>
				typeof value == 'bigint' ? value.toString() : value
			)
		);

		// Expect a valid success status code
		expect(appResponse.statusCode).toEqual(201);

		// Expect db after response and modification agree
		expect(appResponse.body).toEqual(dbResponseJson);
	});

	// ***************
	// DELETE a User *
	// ***************
	// test('Delete user by id', async () => {
	// 	// Get the db record before deletion
	// 	const dbResponseBefore = await prisma.user.findUnique({
	// 		where: {
	// 			id: userId,
	// 		},
	// 	});
	// 	const dbResponseBeforeJson = JSON.parse(
	// 		JSON.stringify(dbResponseBefore, (key: string, value: any): any =>
	// 			typeof value == 'bigint' ? value.toString() : value
	// 		)
	// 	);

	// 	// Send the DELETE request through the application
	// 	const appResponse = await request(app).del(`/api/user/${userId}`);

	// 	// Get the db record after the deletion
	// 	const dbResponseAfter = await prisma.user.findUnique({
	// 		where: {
	// 			id: userId,
	// 		},
	// 	});

	// 	// Expect valid success code
	// 	expect(appResponse.statusCode).toEqual(200);

	// 	// Expect app response to equal database before deletion
	// 	expect(appResponse.body).toEqual(dbResponseBeforeJson);

	// 	// Expect db after deletion to contain no record
	// 	expect(dbResponseAfter).toEqual(null);
	// });
});
