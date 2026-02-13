import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ranks, certificateTypes } from '../data/mockData';
import { toast } from '../hooks/use-toast';

const StaffForm = ({ staff, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    nationalId: '',
    code: '',
    rank: '',
    image: '',
    certificates: []
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (staff) {
      setFormData(staff);
      if (staff.image) {
        setImagePreview(staff.image);
      }
    }
  }, [staff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRankChange = (value) => {
    setFormData(prev => ({ ...prev, rank: value }));
  };

  const handleCertificateToggle = (certificate) => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates.includes(certificate)
        ? prev.certificates.filter(c => c !== certificate)
        : [...prev.certificates, certificate]
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'حجم الصورة كبير جداً',
          description: 'يجب أن يكون حجم الصورة أقل من 5 ميجابايت',
          variant: 'destructive',
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال اسم الموظف',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.nationalId.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال الرقم الوطني',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.code.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال كود الموظف',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.rank) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار رتبة الموظف',
        variant: 'destructive',
      });
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      {/* Image Upload */}
      <div className="space-y-2">
        <Label htmlFor="image">صورة الموظف</Label>
        <div className="flex flex-col items-center gap-4">
          {imagePreview && (
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="cursor-pointer"
          />
        </div>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">اسم الموظف *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="أدخل اسم الموظف"
        />
      </div>

      {/* National ID */}
      <div className="space-y-2">
        <Label htmlFor="nationalId">الرقم الوطني *</Label>
        <Input
          id="nationalId"
          name="nationalId"
          value={formData.nationalId}
          onChange={handleChange}
          required
          placeholder="أدخل الرقم الوطني"
        />
      </div>

      {/* Code */}
      <div className="space-y-2">
        <Label htmlFor="code">كود الموظف  *</Label>
        <Input
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
          placeholder="مثال: 0327"
        />
      </div>

      {/* Rank */}
      <div className="space-y-2">
        <Label htmlFor="rank">الرتبة *</Label>
        <Select value={formData.rank} onValueChange={handleRankChange}>
          <SelectTrigger>
            <SelectValue placeholder="اختر الرتبة" />
          </SelectTrigger>
          <SelectContent>
            {ranks.map((rank) => (
              <SelectItem key={rank} value={rank}>
                {rank}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Certificates */}
      <div className="space-y-3">
        <Label>الشهادات</Label>
        <div className="space-y-3 border rounded-lg p-4 bg-gray-50">
          {certificateTypes.map((cert) => (
            <div key={cert} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id={cert}
                checked={formData.certificates.includes(cert)}
                onCheckedChange={() => handleCertificateToggle(cert)}
              />
              <Label
                htmlFor={cert}
                className="text-sm font-normal cursor-pointer flex-1"
              >
                شهادة {cert}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          {staff ? 'حفظ التغييرات' : 'إضافة الموظف'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          إلغاء
        </Button>
      </div>
    </form>
  );
};

export default StaffForm;