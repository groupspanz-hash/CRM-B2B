import React, { useState } from 'react';
import { Customer, RelationshipLevel, CustomerStatus } from '../types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Users,
  Search, 
  Plus, 
  MoreVertical, 
  Filter, 
  Edit2, 
  Trash2, 
  Activity as ActivityIcon,
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { formatCurrency, cn } from '../lib/utils';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from './ui/dialog';
import { CustomerForm } from './CustomerForm';
import { ActivityLogDialog } from './ActivityLogDialog';

import { RS_LEVELS } from '../constants';

interface CustomerManagementProps {
  customers: Customer[];
  onAdd: (data: any) => Promise<void>;
  onEdit: (id: string, data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onLogActivity: (customerId: string, type: any, notes: string) => Promise<void>;
}

export const CustomerManagement: React.FC<CustomerManagementProps> = ({ 
  customers, 
  onAdd, 
  onEdit, 
  onDelete,
  onLogActivity
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | 'All'>('All');
  const [levelFilter, setLevelFilter] = useState<RelationshipLevel | 'All'>('All');

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.pic1.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesLevel = levelFilter === 'All' || c.rsLevel === levelFilter;
    return matchesSearch && matchesStatus && matchesLevel;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <h1 className="text-xl font-bold tracking-tight text-slate-800">Customer Portfolio</h1>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <Input 
              placeholder="Search company..." 
              className="pl-8 pr-4 py-1.5 bg-slate-100 border-none rounded-md text-xs w-full focus-visible:ring-1 focus-visible:ring-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="outline" className="h-8 rounded text-[11px] font-bold bg-white border-slate-200 text-slate-600 gap-2 px-3">
                <Filter size={14} />
                Level: {levelFilter}
              </Button>
            } />
            <DropdownMenuContent align="end" className="w-48 p-1 rounded-lg border-slate-200 shadow-lg">
              <div className="px-2 py-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">RS Level</div>
              {(['All', 'Cold', 'Warm', 'Engaged', 'Trusted', 'Loyal'] as const).map(l => (
                <DropdownMenuItem key={l} onClick={() => setLevelFilter(l)} className={cn("rounded text-xs", levelFilter === l && "bg-blue-50 text-blue-700 font-bold")}>
                  {l}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog>
            <DialogTrigger render={
              <Button className="h-8 rounded bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-sm px-4 gap-2">
                <Plus size={14} />
                New Customer
              </Button>
            } />
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-lg font-black tracking-tight">Register New B2B Customer</DialogTitle>
              </DialogHeader>
              <CustomerForm onSubmit={onAdd} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="border-slate-200">
              <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-500 py-3 px-6">Company & RS Score</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-500">Contact</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-500">Status</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-500 text-right">Probability</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-500 text-right pr-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <Users size={24} className="opacity-10" />
                    <p className="text-xs font-medium">No results found for your search.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map(customer => (
                <TableRow key={customer.id} className="hover:bg-slate-50/50 border-slate-100 transition-colors group">
                  <TableCell className="py-3 px-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-sm text-slate-800">{customer.companyName}</p>
                        <Badge className={cn("text-[9px] font-black uppercase px-1.5 h-4", RS_LEVELS.find(l => l.label === customer.rsLevel)?.bg, RS_LEVELS.find(l => l.label === customer.rsLevel)?.color)}>
                          {customer.rsLevel}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div 
                              className="h-full bg-indigo-500 transition-all duration-1000" 
                              style={{ width: `${Math.min(100, ((customer.relationshipScore || 0) / 250) * 100)}%` }} 
                           />
                        </div>
                        <span className="text-[10px] font-black text-slate-400">RS: {customer.relationshipScore || 0}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-xs font-bold text-slate-700">{customer.pic1.name}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">{customer.industry}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        customer.status === 'Deal' ? "bg-emerald-500" :
                        customer.status === 'Negosiasi' ? "bg-amber-400" : "bg-rose-500"
                      )} />
                      <span className="text-[11px] font-bold text-slate-700">{customer.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex flex-col items-end">
                      <p className="text-xs font-black text-slate-800">{customer.probability}%</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Opportunity</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <Button variant="ghost" size="icon" className="hover:bg-slate-100 h-8 w-8 rounded text-slate-400">
                          <MoreVertical size={14} />
                        </Button>
                      } />
                      <DropdownMenuContent align="end" className="w-48 p-1 rounded-lg border-slate-200 shadow-xl">
                        <Dialog>
                          <DialogTrigger render={
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="rounded text-xs gap-2 cursor-pointer py-2 text-indigo-600 font-bold">
                              <ActivityIcon size={14} />
                              <span>Log Activity</span>
                            </DropdownMenuItem>
                          } />
                          <DialogContent className="max-w-md rounded-xl">
                             <DialogHeader>
                              <DialogTitle className="text-lg font-black tracking-tight">Log Interaction: {customer.companyName}</DialogTitle>
                            </DialogHeader>
                            <ActivityLogDialog 
                              customer={customer} 
                              onLog={(type, notes) => onLogActivity(customer.id, type, notes)} 
                            />
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger render={
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="rounded text-xs gap-2 cursor-pointer py-2">
                              <Edit2 size={14} className="text-slate-400" />
                              <span>Edit Customer</span>
                            </DropdownMenuItem>
                          } />
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border-none shadow-2xl">
                             <DialogHeader>
                              <DialogTitle className="text-lg font-black tracking-tight">Editing: {customer.companyName}</DialogTitle>
                            </DialogHeader>
                            <CustomerForm customer={customer} onSubmit={(data) => onEdit(customer.id, data)} />
                          </DialogContent>
                        </Dialog>
                        
                        <DropdownMenuItem onClick={() => onDelete(customer.id)} className="rounded text-xs gap-2 text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer py-2">
                          <Trash2 size={14} />
                          <span>Delete Customer</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
