import React, { useState } from 'react';
import { Customer, Schedule, ActivityType } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarIcon, CheckCircle2, Clock, Plus, MapPin, Trophy } from 'lucide-react';
import { format, isBefore } from 'date-fns';
import { cn } from '../lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Timestamp } from 'firebase/firestore';
import { ACTIVITY_GROUPS } from '../constants';

interface ScheduleListProps {
  schedules: Schedule[];
  customers: Customer[];
  onAdd: (data: any) => Promise<void>;
  onComplete: (id: string) => Promise<void>;
}

export const ScheduleList: React.FC<ScheduleListProps> = ({ schedules, customers, onAdd, onComplete }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedType, setSelectedType] = useState<ActivityType>('meeting');
  const [date, setDate] = useState<Date>();
  const [notes, setNotes] = useState('');

  const handleAdd = async () => {
    if (!selectedCustomerId || !date) return;
    await onAdd({
      customerId: selectedCustomerId,
      type: selectedType,
      date: Timestamp.fromDate(date),
      notes,
      status: 'pending'
    });
    setNotes('');
    setDate(undefined);
    setSelectedCustomerId('');
    setSelectedType('meeting');
  };

  const sortedSchedules = [...schedules].sort((a, b) => {
    const timeA = a.date?.seconds || 0;
    const timeB = b.date?.seconds || 0;
    return timeB - timeA;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in duration-500">
      {/* Create Schedule */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
            <h3 className="text-[11px] font-bold uppercase text-slate-600 tracking-tighter">New Appointment</h3>
          </div>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Select Customer</Label>
              <Select onValueChange={setSelectedCustomerId} value={selectedCustomerId}>
                <SelectTrigger className="rounded-md border-slate-200 h-9 text-xs bg-slate-50">
                  <SelectValue placeholder="Pilih pelanggan..." />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  {customers.map(c => (
                    <SelectItem key={c.id} value={c.id} className="text-xs">{c.companyName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Tujuan Perjumpaan</Label>
              <Select onValueChange={(val) => setSelectedType(val as ActivityType)} value={selectedType}>
                <SelectTrigger className="rounded-md border-slate-200 h-9 text-xs bg-slate-50">
                  <SelectValue placeholder="Pilih tujuan..." />
                </SelectTrigger>
                <SelectContent className="rounded-lg max-h-[300px]">
                  {ACTIVITY_GROUPS.map(group => (
                    <div key={group.label}>
                      <div className="px-2 py-1 text-[9px] font-black text-slate-400 bg-slate-50">{group.label}</div>
                      {group.items.map(item => (
                        <SelectItem key={item.id} value={item.id} className="text-xs">
                          <div className="flex items-center gap-2">
                             <span className="text-slate-400">{item.icon}</span>
                             <span>{item.label}</span>
                             <span className="ml-auto text-[10px] font-black text-indigo-600">+{item.points}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Visit Date</Label>
              <Popover>
                <PopoverTrigger render={
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-md border-slate-200 h-9 text-xs bg-slate-50",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5 text-slate-400" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                } />
                <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="rounded-xl"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Activity Notes</Label>
              <Input 
                placeholder="Tujuan kunjungan..." 
                className="rounded-md border-slate-200 h-9 text-xs bg-slate-50"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 h-9 rounded-md shadow-lg shadow-blue-500/20 mt-2 text-[11px] font-bold uppercase tracking-widest text-white"
              disabled={!selectedCustomerId || !date}
              onClick={handleAdd}
            >
              <Plus size={14} className="mr-2" />
              Schedule Visit
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Schedule List */}
      <div className="lg:col-span-3 space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[11px] font-bold uppercase text-slate-400 tracking-[0.2em] ml-1">Appointment Pipeline</h3>
          <div className="flex gap-2">
             <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded uppercase tracking-tighter shadow-sm">
               <Clock size={12} className="text-amber-500" />
               Next Visits
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedSchedules.map(schedule => {
            const customer = customers.find(c => c.id === schedule.customerId);
            const isPast = isBefore(schedule.date.toDate(), new Date()) && schedule.status === 'pending';

            return (
              <Card key={schedule.id} className={cn(
                "border-slate-200 shadow-sm transition-all group rounded-xl overflow-hidden bg-white",
                schedule.status === 'completed' && "opacity-60 grayscale-[0.5]"
              )}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={cn(
                    "w-11 h-11 rounded-lg flex flex-col items-center justify-center shrink-0 transition-colors",
                    schedule.status === 'completed' ? "bg-slate-100 text-slate-400" : 
                    isPast ? "bg-rose-50 text-rose-600 shadow-rose-100 shadow-lg" : "bg-[#0F172A] text-white shadow-slate-900/10 shadow-lg"
                  )}>
                    <span className="text-[8px] font-bold uppercase tracking-widest opacity-70 leading-none">
                      {format(schedule.date.toDate(), "MMM")}
                    </span>
                    <span className="text-base font-black leading-tight mt-0.5">
                      {format(schedule.date.toDate(), "dd")}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-slate-800 truncate text-sm">
                        {customer?.companyName || 'Unknown Customer'}
                      </p>
                      {schedule.status === 'completed' && <CheckCircle2 size={12} className="text-emerald-500" />}
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                       <span className="text-[9px] font-black uppercase bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100 flex items-center gap-1">
                         {schedule.type.replace('_', ' ')}
                       </span>
                       <p className="text-[10px] text-slate-400 font-medium truncate flex items-center gap-1">
                        <MapPin size={10} className="text-slate-300" />
                        {customer?.address || 'No address'}
                      </p>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed italic border-l-2 border-slate-100 pl-2">"{schedule.notes}"</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 opacity-100 transition-opacity">
                    {schedule.status === 'pending' && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="rounded-md text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-8 px-3 text-[10px] font-bold uppercase tracking-widest border border-emerald-100"
                        onClick={() => onComplete(schedule.id)}
                      >
                        Done
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {schedules.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 bg-white/50 border-2 border-dashed border-slate-200 rounded-3xl">
            <CalendarIcon size={40} className="opacity-10 mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Papan Jadwal Kosong</p>
          </div>
        )}
      </div>
    </div>
  );
};

