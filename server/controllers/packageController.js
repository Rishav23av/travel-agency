const Package = require('../models/Package');

// Get all packages
const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });
    res.json(packages);
  } catch (error) {
    console.error('Get all packages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get package by ID
const getPackageById = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    res.json(package);
  } catch (error) {
    console.error('Get package by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new package (admin only)
const createPackage = async (req, res) => {
  try {
    const { title, location, price, description, image } = req.body;

    const newPackage = new Package({
      title,
      location,
      price,
      description,
      image,
      createdBy: req.user._id
    });

    await newPackage.save();

    res.status(201).json({
      message: 'Package created successfully',
      package: newPackage
    });
  } catch (error) {
    console.error('Create package error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update package (admin only)
const updatePackage = async (req, res) => {
  try {
    const { title, location, price, description, image } = req.body;

    const package = await Package.findById(req.params.id);
    
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    package.title = title || package.title;
    package.location = location || package.location;
    package.price = price || package.price;
    package.description = description || package.description;
    package.image = image || package.image;

    await package.save();

    res.json({
      message: 'Package updated successfully',
      package
    });
  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete package (admin only)
const deletePackage = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    await Package.findByIdAndDelete(req.params.id);

    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage
};
