import React, { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  Timestamp, 
  orderBy,
  setDoc,
  getDocs
} from 'firebase/firestore';
import { db, auth } from './lib/firebase';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { CustomerManagement } from './components/CustomerManagement';
import { Kanban } from './components/Kanban';
import { ScheduleList } from './components/ScheduleList';
import { Customer, Activity, Schedule, OperationType } from './types';
import { handleFirestoreError } from './lib/utils';
import { calculateRSLevel, calculateProbabilityFromRS, getPointsForActivity, calculateTimeDecay } from './lib/rsLogic';
import { Button } from './components/ui/button';
import { Toaster, toast } from 'sonner';

const AppContent = () => {
  const { user, profile, signIn, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !profile) {
      setLoading(false);
      return;
    }

    setLoading(true);
    // Fetch Customers
    const qCustomers = profile.role === 'admin' 
      ? query(collection(db, 'customers'), orderBy('updatedAt', 'desc'))
      : query(collection(db, 'customers'), where('ownerId', '==', user.uid), orderBy('updatedAt', 'desc'));

    const unsubCustomers = onSnapshot(qCustomers, (snapshot) => {
      const rawCustomers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
      
      // Apply Time Decay
      const decayedCustomers = rawCustomers.map(c => {
        const decayedScore = calculateTimeDecay(
          c.relationshipScore || 0, 
          c.lastActivityDate ? c.lastActivityDate.toDate() : (c.createdAt ? c.createdAt.toDate() : null)
        );
        
        if (decayedScore !== c.relationshipScore) {
          return {
            ...c,
            relationshipScore: decayedScore,
            rsLevel: calculateRSLevel(decayedScore),
            probability: calculateProbabilityFromRS(decayedScore, c.status)
          };
        }
        return c;
      });

      setCustomers(decayedCustomers);
      setLoading(false);
    }, (error) => {
      setLoading(false);
      handleFirestoreError(error, OperationType.LIST, 'customers');
    });

    // Fetch Activities
    const qActivities = profile.role === 'admin'
      ? query(collection(db, 'activities'), orderBy('date', 'desc'))
      : query(collection(db, 'activities'), where('ownerId', '==', user.uid), orderBy('date', 'desc'));

    const unsubActivities = onSnapshot(qActivities, (snapshot) => {
      setActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'activities');
    });

    // Fetch Schedules
    const qSchedules = profile.role === 'admin'
      ? query(collection(db, 'schedules'), orderBy('date', 'asc'))
      : query(collection(db, 'schedules'), where('ownerId', '==', user.uid), orderBy('date', 'asc'));

    const unsubSchedules = onSnapshot(qSchedules, (snapshot) => {
      setSchedules(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Schedule)));
    });

    return () => {
      unsubCustomers();
      unsubActivities();
      unsubSchedules();
    };
  }, [user, profile]);

  // Event Handlers
  const handleAddCustomer = async (data: any) => {
    try {
      const initialScore = 0;
      const initialLevel = calculateRSLevel(initialScore);
      const docData = {
        ...data,
        ownerId: user?.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        relationshipScore: initialScore,
        rsLevel: initialLevel,
        probability: calculateProbabilityFromRS(initialScore, data.status)
      };
      await addDoc(collection(db, 'customers'), docData);
      toast.success('Customer profile created successfully');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'customers');
    }
  };

  const handleEditCustomer = async (id: string, data: any) => {
    try {
      const currentRS = data.relationshipScore ?? 0;
      const docData = {
        ...data,
        updatedAt: Timestamp.now(),
        rsLevel: calculateRSLevel(currentRS),
        probability: calculateProbabilityFromRS(currentRS, data.status)
      };
      await updateDoc(doc(db, 'customers', id), docData);
      toast.success('Customer profile updated');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `customers/${id}`);
    }
  };

  const handleLogActivity = async (customerId: string, activityType: any, notes: string) => {
    try {
      const points = getPointsForActivity(activityType);
      const customer = customers.find(c => c.id === customerId);
      if (!customer) return;

      const newScore = Math.max(0, (customer.relationshipScore || 0) + points);
      
      // Log the activity
      await addDoc(collection(db, 'activities'), {
        customerId,
        type: activityType,
        date: Timestamp.now(),
        actorName: profile?.name || 'Sales',
        notes,
        points,
        ownerId: user?.uid
      });

      // Update customer score
      await updateDoc(doc(db, 'customers', customerId), {
        relationshipScore: newScore,
        rsLevel: calculateRSLevel(newScore),
        probability: calculateProbabilityFromRS(newScore, customer.status),
        lastActivityDate: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      toast.success(`Activity logged: +${points} Relationship Points`);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'activities');
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    try {
      await deleteDoc(doc(db, 'customers', id));
      toast.success('Customer deleted');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `customers/${id}`);
    }
  };

  const handleAddSchedule = async (data: any) => {
    try {
      await addDoc(collection(db, 'schedules'), {
        ...data,
        ownerId: user?.uid
      });
      toast.success('Visit scheduled');
    } catch (error) {
       handleFirestoreError(error, OperationType.CREATE, 'schedules');
    }
  };

  const handleCompleteSchedule = async (id: string) => {
    try {
      const sched = schedules.find(s => s.id === id);
      const customer = customers.find(c => c.id === sched?.customerId);
      if (!sched || !customer) return;

      const activityType = sched.type;
      const points = getPointsForActivity(activityType);
      const newScore = Math.max(0, (customer.relationshipScore || 0) + points);

      await updateDoc(doc(db, 'schedules', id), { status: 'completed' });
      
      await addDoc(collection(db, 'activities'), {
        customerId: sched.customerId,
        type: activityType,
        date: Timestamp.now(),
        actorName: profile?.name || 'Sales',
        notes: `Jadwal Selesai: ${sched.notes}`,
        points,
        ownerId: user?.uid
      });

      await updateDoc(doc(db, 'customers', sched.customerId), {
        relationshipScore: newScore,
        rsLevel: calculateRSLevel(newScore),
        probability: calculateProbabilityFromRS(newScore, customer.status),
        lastActivityDate: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      toast.success(`${activityType.replace('_', ' ')} completed: +${points} Relationship Points`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `schedules/${id}`);
    }
  };

  if (authLoading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 font-sans p-6">
        <Toaster position="top-right" richColors />
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl shadow-indigo-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg shadow-indigo-200">
            W
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">WiFi CRM B2B</h1>
          <p className="text-slate-500 mb-8 max-w-xs mx-auto">Manage your corporate internet customers with style and smart insights.</p>
          <button 
            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-lg font-bold shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-colors"
            onClick={signIn}
          >
            Sign in with Google
          </button>
          <p className="mt-8 text-xs text-slate-400 font-medium uppercase tracking-widest">Enterprise Solution v1.0</p>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <Toaster position="top-right" richColors />
      <div className="max-w-7xl mx-auto pb-12">
        {activeTab === 'dashboard' && <Dashboard customers={customers} activities={activities} schedules={schedules} />}
        {activeTab === 'customers' && (
          <CustomerManagement 
            customers={customers} 
            onAdd={handleAddCustomer} 
            onEdit={handleEditCustomer} 
            onDelete={handleDeleteCustomer}
            onLogActivity={handleLogActivity}
          />
        )}
        {activeTab === 'pipeline' && <Kanban customers={customers} onStatusChange={handleEditCustomer} />}
        {activeTab === 'schedule' && (
          <ScheduleList 
            schedules={schedules} 
            customers={customers} 
            onAdd={handleAddSchedule} 
            onComplete={handleCompleteSchedule} 
          />
        )}
      </div>
    </Layout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
