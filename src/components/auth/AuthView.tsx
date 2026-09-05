import React, { useState } from 'react';
import { AuthGateway } from './AuthGateway';
import { OperatorLogin } from './OperatorLogin';
import { MerchantProvision } from './MerchantProvision';
import { ProvisionSuccess } from './ProvisionSuccess';

type AuthRoute = 'GATEWAY' | 'OPERATOR_LOGIN' | 'MERCHANT_PROVISION' | 'PROVISION_SUCCESS';

export const AuthView: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AuthRoute>('GATEWAY');
  const [provisionedEmail, setProvisionedEmail] = useState<string>('');

  const handleModeSelect = (mode: 'OPERATOR' | 'MERCHANT') => {
    if (mode === 'OPERATOR') {
      setCurrentRoute('OPERATOR_LOGIN');
    } else {
      setCurrentRoute('MERCHANT_PROVISION');
    }
  };

  const handleProvisionSuccess = (email: string) => {
    setProvisionedEmail(email);
    setCurrentRoute('PROVISION_SUCCESS');
  };

  switch (currentRoute) {
    case 'OPERATOR_LOGIN':
      return <OperatorLogin onBack={() => setCurrentRoute('GATEWAY')} />;
    
    case 'MERCHANT_PROVISION':
      return (
        <MerchantProvision 
          onBack={() => setCurrentRoute('GATEWAY')} 
          onSuccess={handleProvisionSuccess} 
        />
      );
    
    case 'PROVISION_SUCCESS':
      return (
        <ProvisionSuccess 
          email={provisionedEmail}
          onEnter={() => setCurrentRoute('OPERATOR_LOGIN')}
          onReturn={() => setCurrentRoute('OPERATOR_LOGIN')}
        />
      );

    case 'GATEWAY':
    default:
      return <AuthGateway onSelectMode={handleModeSelect} />;
  }
};
