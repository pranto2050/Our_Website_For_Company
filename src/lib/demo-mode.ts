// Demo mode for testing without Supabase
export const DEMO_MODE = {
  enabled: true,
  users: {
    client: {
      email: 'demo.client@abitsolutions.com',
      password: 'Demo@123456',
      id: 'demo-client-id',
      full_name: 'Demo Client',
      role: 'client',
      isApproved: true,
    },
    admin: {
      email: 'demo.admin@abitsolutions.com',
      password: 'Admin@123456',
      id: 'demo-admin-id',
      full_name: 'Demo Admin',
      role: 'admin',
      isApproved: true,
    },
  },
};

export function validateDemoCredentials(email: string, password: string) {
  if (email === DEMO_MODE.users.client.email && password === DEMO_MODE.users.client.password) {
    return DEMO_MODE.users.client;
  }
  if (email === DEMO_MODE.users.admin.email && password === DEMO_MODE.users.admin.password) {
    return DEMO_MODE.users.admin;
  }
  return null;
}
