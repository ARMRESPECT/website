import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import StaffCard from '../components/StaffCard';
import StaffForm from '../components/StaffForm';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Plus, Users } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { mockStaff } from '../data/mockData';

const Admin = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    // Load staff from localStorage
    const savedStaff = localStorage.getItem('staffMembers');
    if (savedStaff) {
      setStaff(JSON.parse(savedStaff));
    } else {
      setStaff(mockStaff);
      localStorage.setItem('staffMembers', JSON.stringify(mockStaff));
    }
  }, []);

  const handleAddStaff = (newStaff) => {
    const staffWithId = {
      ...newStaff,
      id: Date.now().toString()
    };
    const updatedStaff = [...staff, staffWithId];
    setStaff(updatedStaff);
    localStorage.setItem('staffMembers', JSON.stringify(updatedStaff));
    setIsFormOpen(false);
    toast({
      title: 'تم إضافة الموظف بنجاح',
      description: `تم إضافة ${newStaff.name} إلى قائمة الموظفين`,
    });
  };

  const handleEditStaff = (updatedStaff) => {
    const updatedStaffList = staff.map(s => 
      s.id === updatedStaff.id ? updatedStaff : s
    );
    setStaff(updatedStaffList);
    localStorage.setItem('staffMembers', JSON.stringify(updatedStaffList));
    setIsFormOpen(false);
    setEditingStaff(null);
    toast({
      title: 'تم تحديث الموضف بنجاح',
      description: `تم تحديث بيانات ${updatedStaff.name}`,
    });
  };

  const handleDeleteStaff = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
      const updatedStaff = staff.filter(s => s.id !== id);
      setStaff(updatedStaff);
      localStorage.setItem('staffMembers', JSON.stringify(updatedStaff));
      toast({
        title: 'تم حذف الموظف بنجاح',
        description: 'تم حذف الموظف من القائمة',
      });
    }
  };

  const openAddForm = () => {
    setEditingStaff(null);
    setIsFormOpen(true);
  };

  const openEditForm = (staff) => {
    setEditingStaff(staff);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              لوحة التحكم
            </h2>
            <p className="text-gray-400 mt-2">إدارة جيش ريسبكت</p>
          </div>
          
          <Button
            onClick={openAddForm}
            className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-base px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            إضافة موظف جديد
          </Button>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8 border border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-300">إجمالي الموظفين</h3>
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mt-1">
                {staff.length}
              </p>
            </div>
          </div>
        </div>

        {staff.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/30 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700/50">
            <p className="text-xl text-gray-400 mb-6">لا توجد بيانات للعرض</p>
            <Button 
              onClick={openAddForm} 
              className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="w-5 h-5" />
              إضافة أول موظف
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {staff.map((member) => (
              <StaffCard
                key={member.id}
                staff={member}
                showActions={true}
                onEdit={openEditForm}
                onDelete={handleDeleteStaff}
              />
            ))}
          </div>
        )}
      </main>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white">
              {editingStaff ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}
            </DialogTitle>
          </DialogHeader>
          <StaffForm
            staff={editingStaff}
            onSubmit={editingStaff ? handleEditStaff : handleAddStaff}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingStaff(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;