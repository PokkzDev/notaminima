'use client';

import { SessionProvider } from 'next-auth/react';
import PropTypes from 'prop-types';

export default function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};






