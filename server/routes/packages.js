const express = require('express');
const router = express.Router();
const {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage
} = require('../controllers/packageController');
const { auth, adminAuth } = require('../middleware/auth');

// Public routes
router.get('/', getAllPackages);
router.get('/:id', getPackageById);

// Admin only routes
router.post('/', adminAuth, createPackage);
router.put('/:id', adminAuth, updatePackage);
router.delete('/:id', adminAuth, deletePackage);

module.exports = router;
