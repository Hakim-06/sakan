const Annonce = require('../models/Annonce');

// @desc    Créer une nouvelle annonce
// @route   POST /api/annonces
// @access  Privé
const createAnnonce = async (req, res) => {
  try {
    // 1. N-stqblou l-m3loumat li sifet l-Frontend
    const { city, budget, description, amenities } = req.body;

    // 2. N-wejdou t-tsawer (Multer/Cloudinary k-y-7etouhom f `req.files`)
    let photosArray = [];
    if (req.files && req.files.length > 0) {
      photosArray = req.files.map((file) => ({
        url: file.path,       // L-Lien dyal t-tswira f Cloudinary
        public_id: file.filename // L-ID dyalha (k-n7tajouh ila bghina n-ms7ouha mn be3d)
      }));
    }

    // 3. N-creyiw l-annonce jdida b l-Model dyalna
    const newAnnonce = new Annonce({
      owner: req.user.id, // L-ID dyal l-user li m-connecté
      city,
      budget,
      description,
      // Ila kanu amenities jayin b7al 'Wi-Fi Fibre,Balcon', n-rdouhom Array
      amenities: Array.isArray(amenities) ? amenities : (amenities ? amenities.split(',') : []),
      photos: photosArray
    });

    // 4. N-sauvgardiwha f MongoDB
    const savedAnnonce = await newAnnonce.save();

    res.status(201).json({
      success: true,
      message: '✅ Annonce t-kreyat b naja7!',
      annonce: savedAnnonce
    });

  } catch (error) {
    console.error('❌ Erreur f création d\'annonce:', error.message);
    res.status(500).json({ success: false, message: "Mouchkil f l-Backend", error: error.message });
  }
};

module.exports = {
  createAnnonce
};