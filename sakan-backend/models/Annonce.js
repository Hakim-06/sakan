const mongoose = require('mongoose');

const AnnonceSchema = new mongoose.Schema({

  // ── Auteur ────────────────────────────────────────
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // ── Infos logement ────────────────────────────────
  city:        { type: String, required: [true, 'Ville requise'], trim: true },
  budget:      { type: Number, required: [true, 'Loyer requis'], min: 100, max: 20000 },
  description: { type: String, maxlength: 1000, default: '' },

  // ── Photos (Cloudinary) ───────────────────────────
  photos: [{
    url:       { type: String, required: true },
    public_id: { type: String, required: true },
  }],

  // ── Équipements ───────────────────────────────────
  amenities: [{
    type: String,
    enum: ['Wi-Fi Fibre','Balcon','Cuisine équipée','Climatisation','Parking','Eau chaude','Proche Tram','Salle de sport','Sécurisé 24/7','Jardin/Terrasse'],
  }],

  // ── Statut ────────────────────────────────────────
  isActive:   { type: Boolean, default: true },
  views:      { type: Number,  default: 0 },
  favoritedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

}, { timestamps: true });

// ─── Index for search performance ────────────────────
AnnonceSchema.index({ city: 1, budget: 1 });
AnnonceSchema.index({ owner: 1 });
AnnonceSchema.index({ isActive: 1 });

// ─── Virtual: favorites count ─────────────────────────
AnnonceSchema.virtual('favoritesCount').get(function () {
  return this.favoritedBy.length;
});

module.exports = mongoose.model('Annonce', AnnonceSchema);