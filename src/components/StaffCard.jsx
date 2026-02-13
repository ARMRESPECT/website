import React from 'react';
import { Badge } from './ui/badge';

const StaffCard = ({ staff, showActions, onEdit, onDelete }) => {
  return (
    <div className="relative group">
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1">
        {/* Code Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm px-4 py-1.5 rounded-full shadow-lg">
            {staff.code}
          </div>
        </div>

        {/* Image */}
        <div className="flex justify-center mb-4 pt-2">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/30 shadow-xl">
              <img
                src={staff.image}
                alt={staff.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                }}
              />
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20"></div>
          </div>
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold text-white text-center mb-4">{staff.name}</h3>
        
        {/* Details */}
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between items-center text-gray-300">
            <span className="opacity-70">الرقم الوطني:</span>
            <span className="font-bold text-white">{staff.nationalId}</span>
          </div>
          
          <div className="flex justify-between items-center text-gray-300">
            <span className="opacity-70">الرتبة:</span>
            <span className="font-bold text-white">{staff.rank}</span>
          </div>
        </div>

        {/* Certificates */}
        {staff.certificates && staff.certificates.length > 0 && (
          <div className="pt-3 border-t border-slate-700/50">
            <div className="flex flex-wrap gap-2 justify-center">
              {staff.certificates.map((cert, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md"
                >
                  شهادة {cert}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="pt-4 border-t border-slate-700/50 mt-4 flex gap-2">
            <button
              onClick={() => onEdit(staff)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              تعديل
            </button>
            <button
              onClick={() => onDelete(staff.id)}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              حذف
            </button>
          </div>
        )}

        {/* Dots indicator (decorative) */}
        <div className="flex justify-center gap-1.5 mt-4">
          <div className="w-2 h-2 rounded-full bg-slate-600"></div>
          <div className="w-2 h-2 rounded-full bg-slate-600"></div>
          <div className="w-2 h-2 rounded-full bg-slate-600"></div>
        </div>
      </div>
    </div>
  );
};

export default StaffCard;