const express = require('express');
const Annonce = require('../models/Annonce');
const { protect } = require('../middleware/auth');
const { deleteFromCloudinary } = require('../middleware/upload');
const { sortAnnoncesByCompatibility } = require('../utils/matching');

const router = express.Router();

// 1. GET ALL ANNONCES
router.get('/', protect, async (req, res) => {
  try {
    const { city, minBudget, maxBudget, amenity, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (city)      filter.city   = { $regex: city, $options: 'i' };
    if (minBudget) filter.budget = { ...filter.budget, $gte: Number(minBudget) };
    if (maxBudget) filter.budget = { ...filter.budget, $lte: Number(maxBudget) };
    if (amenity)   filter.amenities = amenity;

    const total    = await Annonce.countDocuments(filter);
    const annonces = await Annonce.find(filter)
      .populate('owner', 'name age gender ecole city budget bio photo isOnline lastSeen traits preferences profileComplete')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const currentUser = req.user;
    const sorted = sortAnnoncesByCompatibility(currentUser, annonces);

    res.json({
      success: true,
      count: sorted.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      annonces: sorted,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// 2. GET MY ANNONCES
router.get('/mine', protect, async (req, res) => {
  try {
    const annonces = await Annonce.find({ owner: req.user._id })
      .populate('owner', 'name age gender ecole city budget bio photo isOnline lastSeen traits preferences profileComplete')
      .sort({ createdAt: -1 });
    res.json({ success: true, annonces });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// 3. GET SINGLE ANNONCE
router.get('/:id', protect, async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id)
      .populate('owner', 'name age gender ecole city budget bio photo isOnline lastSeen traits preferences profileComplete');
    if (!annonce) return res.status(404).json({ success: false, message: 'Annonce introuvable.' });
    
    annonce.views += 1;
    await annonce.save({ validateBeforeSave: false });
    res.json({ success: true, annonce });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// 4. CREATE ANNONCE (Version m-rigla)
router.post('/', protect, async (req, res) => {
  try {
    const { city, budget, description, amenities, photos } = req.body;
    if (!city || !budget) {
      return res.status(400).json({ success: false, message: 'Ville et loyer requis.' });
    }

    const userId = req.user._id || req.user.id || req.user.userId;
    if (!userId) {
       return res.status(401).json({ success: false, message: "Utilisateur non identifié." });
    }

    const annonce = await Annonce.create({
      owner: userId,
      city,
      budget: Number(budget),
      description: description || '',
      amenities:   amenities   || [],
      photos:      photos      || [],
      isActive: true // 👈 Darouri t-koun true bach t-ban f l-Feed
    });

    await annonce.populate('owner', 'name age gender ecole city budget bio photo isOnline lastSeen traits preferences profileComplete');
    res.status(201).json({ success: true, annonce });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 5. UPDATE ANNONCE
router.put('/:id', protect, async (req, res) => {
  try {
    let annonce = await Annonce.findById(req.params.id);
    if (!annonce) return res.status(404).json({ success: false, message: 'Annonce introuvable.' });
    if (annonce.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Non autorisé.' });
    }
    const allowed = ['city', 'budget', 'description', 'amenities', 'photos', 'isActive'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    annonce = await Annonce.findByIdAndUpdate(req.params.id, updates, {
      new: true, runValidators: true,
    }).populate('owner', 'name age gender ecole city budget bio photo isOnline lastSeen traits preferences profileComplete');
    res.json({ success: true, annonce });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 6. DELETE ANNONCE
router.delete('/:id', protect, async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) return res.status(404).json({ success: false, message: 'Annonce introuvable.' });
    if (annonce.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Non autorisé.' });
    }
    for (const photo of annonce.photos) {
      await deleteFromCloudinary(photo.public_id);
    }
    await annonce.deleteOne();
    res.json({ success: true, message: 'Annonce supprimée.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;