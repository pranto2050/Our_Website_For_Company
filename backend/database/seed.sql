-- ============================================
-- ABIT Solutions - Seed Data
-- Run after schema.sql
-- ============================================

USE abit_solutions;

-- ============================================
-- Insert Default Services
-- ============================================
INSERT INTO services (id, name, slug, description, icon, is_active, display_order) VALUES
(UUID(), 'Web Development', 'web-development', 'Custom website and web application development', 'Globe', TRUE, 1),
(UUID(), 'Mobile App Development', 'mobile-app-development', 'iOS and Android mobile application development', 'Smartphone', TRUE, 2),
(UUID(), 'UI/UX Design', 'ui-ux-design', 'User interface and user experience design services', 'Palette', TRUE, 3),
(UUID(), 'Cloud Solutions', 'cloud-solutions', 'Cloud infrastructure and deployment services', 'Cloud', TRUE, 4),
(UUID(), 'API Development', 'api-development', 'RESTful and GraphQL API development', 'Code', TRUE, 5),
(UUID(), 'E-Commerce Solutions', 'e-commerce', 'Online store and e-commerce platform development', 'ShoppingCart', TRUE, 6),
(UUID(), 'Database Design', 'database-design', 'Database architecture and optimization', 'Database', TRUE, 7),
(UUID(), 'DevOps & CI/CD', 'devops', 'Continuous integration and deployment pipelines', 'Settings', TRUE, 8);

-- ============================================
-- Insert Admin User (password: Admin@123)
-- Note: Replace password hash with bcrypt hash
-- ============================================
INSERT INTO users (id, email, password_hash, email_verified) VALUES
('admin-user-0001-0001-000000000001', 'admin@abit.solutions', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE);

INSERT INTO profiles (id, user_id, full_name, email, registration_status) VALUES
(UUID(), 'admin-user-0001-0001-000000000001', 'System Admin', 'admin@abit.solutions', 'approved');

INSERT INTO user_roles (id, user_id, role) VALUES
(UUID(), 'admin-user-0001-0001-000000000001', 'admin');

-- ============================================
-- Insert Demo Client User (password: Client@123)
-- ============================================
INSERT INTO users (id, email, password_hash, email_verified) VALUES
('demo-user-0001-0001-000000000002', 'demo@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE);

INSERT INTO profiles (id, user_id, full_name, email, phone, company_name, country, registration_status) VALUES
(UUID(), 'demo-user-0001-0001-000000000002', 'Demo Client', 'demo@example.com', '+1234567890', 'Demo Company', 'United States', 'approved');

INSERT INTO user_roles (id, user_id, role) VALUES
(UUID(), 'demo-user-0001-0001-000000000002', 'client');

-- ============================================
-- Verification
-- ============================================
SELECT 'Services inserted:' as info, COUNT(*) as count FROM services;
SELECT 'Users inserted:' as info, COUNT(*) as count FROM users;
SELECT 'Profiles inserted:' as info, COUNT(*) as count FROM profiles;
SELECT 'Roles inserted:' as info, COUNT(*) as count FROM user_roles;
