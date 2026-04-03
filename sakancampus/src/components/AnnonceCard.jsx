import React from 'react';

const AnnonceCard = ({ annonce }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Tswira dyal s-sakan (drna wa7da par defaut ila ma-kanetch) */}
      <img
        src={annonce.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=80"}
        alt={annonce.titre}
        className="w-full h-48 object-cover"
      />
      
      {/* L-m3loumat */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{annonce.titre}</h3>
        
        <p className="text-sm text-gray-500 mb-4 flex items-center">
          <span className="mr-1">📍</span> {annonce.ville}
        </p>
        
        <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-2">
          <span className="text-xl font-extrabold text-orange-500">{annonce.prix}</span>
          <button className="bg-orange-50 px-4 py-2 text-orange-600 font-semibold text-sm rounded-lg hover:bg-orange-500 hover:text-white transition-colors duration-200">
            Chouf
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnonceCard;