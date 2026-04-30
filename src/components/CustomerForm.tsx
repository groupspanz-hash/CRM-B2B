import React from 'react';
import { Customer, CustomerStatus } from '../types';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { BUSINESS_INDUSTRIES } from '../constants';

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: any) => Promise<void>;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onSubmit }) => {
  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm({
    defaultValues: customer ? {
      ...customer,
    } : {
      companyName: '',
      phone: '',
      address: '',
      revenue: 0,
      industry: 'Teknologi & IT',
      status: 'Negosiasi',
      pic1: { name: '', position: '', phone: '', email: '' },
      pic2: { name: '', position: '', phone: '', email: '' },
      birthdayTemplate: 'Hi {name}, Selamat ulang tahun! Semoga sukses selalu bersama {company}.',
    }
  });

  const handleFormSubmit = async (data: any) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Company Info */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Profil Perusahaan</h3>
          <div className="space-y-1.5">
            <Label htmlFor="companyName" className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Nama Perusahaan</Label>
            <Input id="companyName" {...register('companyName' as any, { required: true })} placeholder="PT. Sukses Bersama" className="bg-slate-50 border-slate-200 rounded-md text-sm h-9" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Nomor Kantor / WA</Label>
            <Input id="phone" {...register('phone' as any)} placeholder="+62 812..." className="bg-slate-50 border-slate-200 rounded-md text-sm h-9" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Alamat Lengkap</Label>
            <Textarea id="address" {...register('address' as any)} placeholder="Jl. Sudirman No. 10..." className="bg-slate-50 border-slate-200 rounded-md text-sm min-h-[80px]" />
          </div>
        </div>

        {/* Business Info */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Detail Sales</h3>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Status Hubungan</Label>
            <Select onValueChange={(val) => setValue('status' as any, val)} defaultValue={customer?.status || 'Negosiasi'}>
              <SelectTrigger className="bg-slate-50 border-slate-200 rounded-md text-sm h-9">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-slate-200">
                <SelectItem value="Negosiasi">Negosiasi</SelectItem>
                <SelectItem value="Deal">Deal (Aktif)</SelectItem>
                <SelectItem value="Menolak">Menolak</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Bidang Usaha</Label>
            <Select onValueChange={(val) => setValue('industry' as any, val)} defaultValue={customer?.industry || 'Teknologi & IT'}>
              <SelectTrigger className="bg-slate-50 border-slate-200 rounded-md text-sm h-9">
                <SelectValue placeholder="Pilih bidang usaha" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-slate-200">
                {BUSINESS_INDUSTRIES.map(ind => (
                  <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Potensi Revenue (Per Bulan)</Label>
            <Input id="revenue" type="number" {...register('revenue' as any, { valueAsNumber: true })} placeholder="0" className="bg-slate-50 border-slate-200 rounded-md text-sm h-9 font-black" />
          </div>
          
          {customer && (
             <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Automated Metrics</span>
               <div className="flex items-center justify-between mt-2">
                 <span className="text-[11px] font-bold text-slate-600">Relationship Score</span>
                 <span className="text-xs font-black text-indigo-600">{customer.relationshipScore || 0} ({customer.rsLevel})</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-[11px] font-bold text-slate-600">Probability Closing</span>
                 <span className="text-xs font-black text-emerald-600">{customer.probability || 0}%</span>
               </div>
             </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 border-t border-slate-100 pt-6">
        {/* PIC 1 */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">PIC Utama (1)</h3>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Nama PIC</Label>
            <Input {...register('pic1.name' as any)} className="bg-slate-50 border-slate-200 rounded-md text-sm h-9" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Jabatan</Label>
              <Input {...register('pic1.position' as any)} className="bg-slate-50 border-slate-200 rounded-md text-sm h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Nomor HP</Label>
              <Input {...register('pic1.phone' as any)} className="bg-slate-50 border-slate-200 rounded-md text-sm h-9" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Email</Label>
              <Input type="email" {...register('pic1.email' as any)} className="bg-slate-50 border-slate-200 rounded-md text-sm h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Ulang Tahun</Label>
              <Input type="date" {...register('pic1.birthday' as any)} className="bg-slate-50 border-slate-200 rounded-md text-sm h-9" />
            </div>
          </div>
        </div>

        {/* PIC 2 */}
         <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">PIC Cadangan (2)</h3>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Nama PIC</Label>
            <Input {...register('pic2.name' as any)} className="bg-slate-50 border-slate-200 rounded-md text-sm h-9" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Jabatan</Label>
              <Input {...register('pic2.position' as any)} className="bg-slate-50 border-slate-200 rounded-md text-sm h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Nomor HP</Label>
              <Input {...register('pic2.phone' as any)} className="bg-slate-50 border-slate-200 rounded-md text-sm h-9" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Email</Label>
              <Input type="email" {...register('pic2.email' as any)} className="bg-slate-50 border-slate-200 rounded-md text-sm h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Ulang Tahun</Label>
              <Input type="date" {...register('pic2.birthday' as any)} className="bg-slate-50 border-slate-200 rounded-md text-sm h-9" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md h-9 px-10 text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-500/20"
        >
          {isSubmitting ? 'Saving...' : (customer ? 'Simpan Perubahan' : 'Daftarkan Customer')}
        </Button>
      </div>
    </form>
  );
};
