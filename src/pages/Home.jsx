import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import StaffCard from '../components/StaffCard';
import { mockStaff } from '../data/mockData';
import { Search } from 'lucide-react';

const Home = () => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const savedStaff = localStorage.getItem('staffMembers');
      if (savedStaff) {
        const parsedStaff = JSON.parse(savedStaff);
        setStaff(parsedStaff);
        setFilteredStaff(parsedStaff);
      } else {
        setStaff(mockStaff);
        setFilteredStaff(mockStaff);
        localStorage.setItem('staffMembers', JSON.stringify(mockStaff));
      }
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStaff(staff);
    } else {
      const filtered = staff.filter(member =>
        member.name.includes(searchTerm) ||
        member.nationalId.includes(searchTerm) ||
        member.code.includes(searchTerm)
      );
      setFilteredStaff(filtered);
    }
  }, [searchTerm, staff]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-400">جاري التحميل...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />
      
      <main className="container mx-auto px-5 py-8">
        {/* Search Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">
             موظفين الجيش
          </h2>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder= " بحث بالاسم أو الرقم الوطني أو الكود"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-full py-4 pr-12 pl-6 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                dir="rtl"
              />
            </div>
          </div>

          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full"></div>
        </div>

        {filteredStaff.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">
              {searchTerm ? 'لا توجد نتائج بحث' : 'لا توجد بيانات للعرض'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredStaff.map((member) => (
              <StaffCard key={member.id} staff={member} showActions={false} />
            ))}
          </div>
        )}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 mt-16 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2026 جيش ريسبكت - جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;