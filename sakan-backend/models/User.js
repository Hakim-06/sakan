const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema({

  // ── Auth ──────────────────────────────────────────
  email: {
    type: String, required: [true, 'Email requis'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide'],
  },
  pendingEmail: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide'],
    default: null,
  },
  emailChangeToken: {
    type: String,
    select: false,
    default: null,
  },
  emailChangeTokenExpires: {
    type: Date,
    select: false,
    default: null,
  },
  emailVerifyToken: {
    type: String,
    select: false,
    default: null,
  },
  emailVerifyTokenExpires: {
    type: Date,
    select: false,
    default: null,
  },
  emailVerifyCodeHash: {
    type: String,
    select: false,
    default: null,
  },
  emailVerifyCodeExpires: {
    type: Date,
    select: false,
    default: null,
  },
  emailVerifyCodeAttempts: {
    type: Number,
    default: 0,
    select: false,
  },
  emailVerifyLastSentAt: {
    type: Date,
    default: null,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
    default: null,
  },
  passwordResetTokenExpires: {
    type: Date,
    select: false,
    default: null,
  },
  password: {
    type: String,
    minlength: [6, 'Minimum 6 caractères'],
    select: false, // never returned by default
  },

  // ── Profil ────────────────────────────────────────
  name:   { type: String, required: [true, 'Prénom requis'], trim: true, maxlength: 50 },
  age:    { type: Number, min: [18, 'Minimum 18 ans'], max: [40, 'Maximum 40 ans'] },
  gender: { type: String, enum: ['Homme', 'Femme', 'Autre'] },
  ecole:  { type: String, trim: true, maxlength: 100 },
  city:   { type: String, trim: true },
  budget: { type: Number, min: 500, max: 5000, default: 1500 },
  bio:    { type: String, maxlength: 500 },
  phone:  { type: String, trim: true },

  // ── Photo ─────────────────────────────────────────
  photo: {
    url:       { type: String, default: '' },
    public_id: { type: String, default: '' },
  },

  // ── Traits de caractère ───────────────────────────
  traits: [{
    type: String,
    enum: ['Calme','Fêtard','Maniaque','Tolérant','Lève-tôt','Couche-tard','Studieux','Sportif','Gourmand','Gamer'],
  }],

  // ── Préférences de coloc ──────────────────────────
  preferences: {
    genderPref:  { type: String, enum: ['Homme', 'Femme', 'Peu importe'], default: 'Peu importe' },
    smokingOk:   { type: Boolean, default: false },
    petsOk:      { type: Boolean, default: false },
    visitorsOk:  { type: Boolean, default: true },
    hidePhone:   { type: Boolean, default: false },
    onlineStatus:{ type: Boolean, default: true },
    emailAlerts: { type: Boolean, default: true },
    darkMode:    { type: Boolean, default: false },
  },

  // ── Favoris (annonces) ────────────────────────────
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Annonce' }],

  // ── Statut ────────────────────────────────────────
  isOnline:        { type: Boolean, default: false },
  lastSeen:        { type: Date,    default: Date.now },
  profileComplete: { type: Boolean, default: false },
  isVerified:      { type: Boolean, default: false },

}, { timestamps: true });

// ─── Hash password before save ───────────────────────
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return; // Plus de next() ici
  this.password = await bcrypt.hash(this.password, 12);
  // Plus de next() à la fin non plus !
});
// ─── Compare password method ─────────────────────────
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Auto-calculate profile completeness ─────────────
UserSchema.methods.checkProfileComplete = function () {
  const required = [this.name, this.age, this.ecole, this.gender, this.city, this.bio];
  this.profileComplete = required.every(Boolean) && this.traits.length > 0;
  return this.profileComplete;
};

// ─── Virtual: public profile (no password) ───────────
UserSchema.virtual('publicProfile').get(function () {
  return {
    _id: this._id, name: this.name, age: this.age,
    gender: this.gender, ecole: this.ecole, city: this.city,
    budget: this.budget, bio: this.bio, traits: this.traits,
    photo: this.photo, isOnline: this.isOnline,
    profileComplete: this.profileComplete,
  };
});

module.exports = mongoose.model('User', UserSchema);