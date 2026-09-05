import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface ProvisionSuccessProps {
  email: string;
  onEnter: () => void;
  onReturn: () => void;
}

export const ProvisionSuccess: React.FC<ProvisionSuccessProps> = ({ email, onEnter, onReturn }) => {
  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto h-16 w-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
          IDENTITY PROVISIONED
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Your secure merchant environment has been created successfully.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#111113] py-8 px-8 shadow sm:rounded-xl border border-white/5 space-y-6">
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-sm text-slate-400">Email</span>
              <span className="text-sm font-medium text-white">{email}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-sm text-slate-400">Status</span>
              <span className="inline-flex items-center rounded-md bg-emerald-400/10 px-2 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-400/20">
                ACTIVE
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-sm text-slate-400">Auth Identity</span>
              <span className="text-sm font-medium text-emerald-400">Created</span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-sm text-slate-400">Merchant Environment</span>
              <span className="text-sm font-medium text-emerald-400">Provisioned</span>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <button
              onClick={onEnter}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-slate-900 bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-slate-900 transition-colors group"
            >
              <span className="flex items-center">
                ENTER MERCHANT ENVIRONMENT
                <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </span>
            </button>
            
            <button
              onClick={onReturn}
              className="w-full flex justify-center py-2.5 px-4 border border-white/10 rounded-lg shadow-sm text-sm font-medium text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-slate-900 transition-colors"
            >
              RETURN TO OPERATOR LOGIN
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};
