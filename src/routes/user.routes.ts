import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const userRoute = Router();
const prisma = new PrismaClient();

// ***************
// POST new User *
// ***************
userRoute.post('/', async (req: Request, res: Response): Promise<void> => {
	try {
		// Create the new user
		const newUser = await prisma.user.create({
			data: {
				email: req.body.email,
				password: req.body.password,
				type: req.body.type,
			},
		});

		res.status(201).json(newUser);
	} catch (error) {
		res.status(500).send({ message: error });
	}
});

// ***************
// GET all Users *
// ***************

userRoute.get('/', async (req: Request, res: Response): Promise<void> => {
	try {
		const allUsers = await prisma.user.findMany();

		res.status(200).json(allUsers);
	} catch (error) {
		res.status(500).send({ message: error });
	}
});

// **************
// GET one User *
// **************
userRoute.get('/:id', async (req: Request, res: Response): Promise<void> => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.params.id,
			},
		});

		res.status(200).json(user);
	} catch (error) {
		res.status(500).send({ message: error });
	}
});

// *****************
// UPDATE one User *
// *****************
userRoute.put('/:id', async (req: Request, res: Response): Promise<void> => {
	try {
		const updatedUser = await prisma.user.update({
			data: {
				email: req.body.email != null ? req.body.email : undefined,
				password: req.body.password != null ? req.body.password : undefined,
				type: req.body.type != null ? req.body.type : undefined,
			},
			where: {
				id: req.params.id,
			},
		});

		res.status(201).json(updatedUser);
	} catch (error) {
		res.status(500).send({ message: error });
	}
});

// ***************
// DELETE a User *
// ***************
userRoute.delete('/:id', async (req: Request, res: Response): Promise<void> => {
	try {
		const deletedUser = await prisma.user.delete({
			where: {
				id: req.params.id,
			},
		});

		res.status(200).json(deletedUser);
	} catch (error) {
		res.status(500).send({ message: error });
	}
});

export { userRoute };
