import React from 'react';
import { Customer, CustomerStatus } from '../types';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { cn, formatCurrency } from '../lib/utils';
import { MoreVertical, Phone, Mail, TrendingUp } from 'lucide-react';

interface KanbanProps {
  customers: Customer[];
  onStatusChange: (id: string, newStatus: CustomerStatus) => Promise<void>;
}

export const Kanban: React.FC<KanbanProps> = ({ customers, onStatusChange }) => {
  const columns: { id: CustomerStatus, label: string, color: string }[] = [
    { id: 'Negosiasi', label: 'In Negotiation', color: 'bg-amber-500' },
    { id: 'Deal', label: 'Closed Deal', color: 'bg-emerald-500' },
    { id: 'Menolak', label: 'Rejected', color: 'bg-rose-500' },
  ];

  const getCustomersByStatus = (status: CustomerStatus) => {
    return customers.filter(c => c.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[600px] animate-in slide-in-from-bottom-4 duration-500">
      {columns.map(column => (
        <div key={column.id} className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full", column.color)} />
              <h3 className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">{column.label} ({column.id === 'Deal' ? '100%' : column.id === 'Negosiasi' ? '50%' : '0%'})</h3>
              <span className="text-[10px] font-black text-slate-400 ml-1">
                {getCustomersByStatus(column.id).length}
              </span>
            </div>
          </div>

          <div className="flex-1 rounded-xl bg-slate-100/50 p-2 space-y-3 border border-slate-200/50">
            {getCustomersByStatus(column.id).map(customer => (
              <Card key={customer.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing rounded-lg overflow-hidden border-l-4 group" style={{ borderLeftColor: column.id === 'Deal' ? '#10b981' : column.id === 'Negosiasi' ? '#f59e0b' : '#f43f5e' }}>
                <CardContent className="p-3 space-y-3 bg-white">
                  <div className="flex justify-between items-start">
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-slate-800 text-sm truncate leading-tight">{customer.companyName}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                         <span className={cn(
                           "text-[9px] font-black uppercase px-1.5 py-0.5 rounded",
                           customer.rsLevel === 'Loyal' ? "bg-emerald-50 text-emerald-700" :
                           customer.rsLevel === 'Trusted' ? "bg-blue-50 text-blue-700" :
                           customer.rsLevel === 'Engaged' ? "bg-indigo-50 text-indigo-700" :
                           customer.rsLevel === 'Warm' ? "bg-orange-50 text-orange-700" : "bg-slate-50 text-slate-700"
                         )}>
                           {customer.rsLevel} (RS: {customer.relationshipScore || 0})
                         </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-500">{formatCurrency(customer.revenue)} /mo</span>
                    <span className="text-[11px] font-black text-slate-800">{customer.probability}%</span>
                  </div>

                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-500",
                        customer.probability >= 70 ? "bg-emerald-500" :
                        customer.probability >= 50 ? "bg-amber-400" : "bg-rose-500"
                      )}
                      style={{ width: `${customer.probability}%` }}
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-50">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">
                        {customer.pic1.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Last visit: 2d ago</span>
                    </div>
                    <div className="flex gap-1">
                       <a href={`tel:${customer.pic1.phone}`} className="p-1 text-slate-300 hover:text-blue-600 transition-colors">
                        <Phone size={12} />
                       </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {getCustomersByStatus(column.id).length === 0 && (
              <div className="h-20 flex items-center justify-center text-slate-300 text-[10px] font-bold uppercase tracking-widest border border-dashed border-slate-300/50 rounded-xl">
                 Empty Stage
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
