import React, { useState } from 'react';
import { Customer, ActivityType } from '../types';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ACTIVITY_POINTS, ACTIVITY_GROUPS } from '../constants';
import { ShieldCheck, Target, MessageSquare, Phone, Users, Video, Gift, Trophy, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface ActivityLogDialogProps {
  customer: Customer;
  onLog: (type: ActivityType, notes: string) => Promise<void>;
}

export const ActivityLogDialog: React.FC<ActivityLogDialogProps> = ({ customer, onLog }) => {
  const [selectedType, setSelectedType] = useState<ActivityType>('chat_wa');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!notes) return;
    setIsSubmitting(true);
    try {
      await onLog(selectedType, notes);
      setNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPoints = ACTIVITY_POINTS[selectedType];

  return (
    <div className="space-y-5 py-2">
      <div className="space-y-1.5">
        <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pilih Jenis Interaksi</Label>
        <Select onValueChange={(val) => setSelectedType(val as ActivityType)} defaultValue="chat_wa">
          <SelectTrigger className="h-10 border-slate-200">
            <SelectValue placeholder="Pilih aktivitas" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] rounded-xl overflow-y-auto">
            {ACTIVITY_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="px-2 py-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                  {group.label}
                </div>
                {group.items.map((item) => (
                  <SelectItem key={item.id} value={item.id} className="text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                      <span className={cn(
                        "ml-auto text-[10px] font-black px-1.5 rounded",
                        item.points > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      )}>
                        {item.points > 0 ? `+${item.points}` : item.points}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Catatan Detail</Label>
        <Textarea 
          placeholder="Tulis apa yang dibicarakan atau detail interaksi..." 
          className="min-h-[100px] text-sm border-slate-200 focus:ring-indigo-500 rounded-lg"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg shadow-sm">
             <Trophy size={20} className={cn(currentPoints > 0 ? "text-amber-500" : "text-rose-500")} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Impact Score</p>
            <p className="text-sm font-black text-indigo-900">
              {currentPoints > 0 ? '+' : ''}{currentPoints} Relationship Points
            </p>
          </div>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || !notes}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9 rounded-lg px-6 shadow-lg shadow-indigo-200"
        >
          {isSubmitting ? 'Saving...' : 'Log & Update RS'}
        </Button>
      </div>
    </div>
  );
};
