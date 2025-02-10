import { Router } from 'express';
import { getScanners, getScannersByEventId, createScanner, updateScanner, deleteScanner, scanId } from '../controllers/scannersController.js';
import isLoggedin from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/scanners', getScanners);
router.get('/scanners/:eventId', getScannersByEventId);
router.post('/scanners', createScanner);
router.put('/scanners/:regno/:eventId', updateScanner);
router.delete('/scanners/:regno/:eventId', deleteScanner);
router.post('/scan',isLoggedin, scanId);

export default router;