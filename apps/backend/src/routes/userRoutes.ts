import express from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser, isBoard, myProfile } from '../controllers/userController.js';
import isLoggedin, { validateGidUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

// router.get('/', getUsers);
router.get('/:id',isLoggedin, getUserById);
router.post('/', validateGidUser,createUser);
router.put('/:id',isLoggedin, updateUser);
router.delete('/:id',isLoggedin, deleteUser);
router.get('/board/check', isLoggedin, isBoard);
    
router.get('/profile/me', isLoggedin, myProfile);

export default router;