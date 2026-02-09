-- ============================================
-- ABIT Solutions - PostgreSQL Seed Data
-- Run AFTER postgresql_schema.sql
-- ============================================

-- ============================================
-- Insert Default Services
-- ============================================
INSERT INTO services (name, slug, description, icon, is_active, display_order) VALUES
('Web Development', 'web-development', 'Custom website and web application development using modern technologies', 'Globe', TRUE, 1),
('Mobile App Development', 'mobile-app-development', 'Native and cross-platform iOS and Android mobile application development', 'Smartphone', TRUE, 2),
('UI/UX Design', 'ui-ux-design', 'User interface and user experience design services with modern aesthetics', 'Palette', TRUE, 3),
('Cloud Solutions', 'cloud-solutions', 'Cloud infrastructure, deployment, and DevOps services', 'Cloud', TRUE, 4),
('API Development', 'api-development', 'RESTful and GraphQL API design and development', 'Code', TRUE, 5),
('E-Commerce Solutions', 'e-commerce', 'Complete online store and e-commerce platform development', 'ShoppingCart', TRUE, 6),
('Database Design', 'database-design', 'Database architecture, optimization, and migration services', 'Database', TRUE, 7),
('DevOps & CI/CD', 'devops', 'Continuous integration, deployment pipelines, and automation', 'Settings', TRUE, 8)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Insert Project Categories
-- ============================================
INSERT INTO project_categories (name, slug, description, icon, base_delivery_days, deposit_percentage, is_active, display_order) VALUES
('Website Development', 'website-development', 'Custom websites and web applications', 'Globe', 30, 30, TRUE, 1),
('Mobile Application', 'mobile-application', 'iOS and Android mobile apps', 'Smartphone', 45, 40, TRUE, 2),
('E-Commerce Platform', 'e-commerce-platform', 'Online stores with payment integration', 'ShoppingCart', 40, 35, TRUE, 3),
('Custom Software', 'custom-software', 'Tailored software solutions', 'Code', 60, 40, TRUE, 4),
('UI/UX Design', 'ui-ux-design', 'Design and prototyping services', 'Palette', 20, 25, TRUE, 5),
('API Integration', 'api-integration', 'Third-party API integration services', 'Plug', 25, 30, TRUE, 6)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Insert Project Tiers
-- ============================================
INSERT INTO project_tiers (tier_key, name, description, icon, color_from, color_to, features, price_multiplier, delivery_multiplier, is_active, display_order) VALUES
('basic', 'Basic', 'Economy option with essential features', 'Star', 'slate-400', 'slate-500', ARRAY['Standard delivery time', 'Basic support', 'Email communication', '2 revision rounds'], 1.00, 1.50, TRUE, 1),
('normal', 'Normal', 'Standard delivery with priority support', 'Zap', 'blue-400', 'blue-600', ARRAY['Priority delivery', 'Standard support', 'Email & chat communication', '5 revision rounds', 'Source code included'], 1.50, 1.00, TRUE, 2),
('premium', 'Premium', 'Fastest delivery with VIP treatment', 'Crown', 'amber-400', 'amber-600', ARRAY['Express delivery', 'VIP 24/7 support', 'All communication channels', 'Unlimited revisions', 'Source code included', '1 month free maintenance', 'Priority bug fixes'], 2.50, 0.50, TRUE, 3)
ON CONFLICT (tier_key) DO NOTHING;

-- ============================================
-- Insert Admin User
-- Password: Admin@123
-- ============================================
INSERT INTO users (id, email, password_hash, email_verified) VALUES
('a0000000-0000-0000-0000-000000000001', 'admin@abit.solutions', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.rE3W4CQJqPzHPa', TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO profiles (user_id, full_name, email, phone, company_name, registration_status) VALUES
('a0000000-0000-0000-0000-000000000001', 'System Administrator', 'admin@abit.solutions', '+1234567890', 'ABIT Solutions', 'approved')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO user_roles (user_id, role) VALUES
('a0000000-0000-0000-0000-000000000001', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================
-- Insert Demo Client User
-- Password: Client@123
-- ============================================
INSERT INTO users (id, email, password_hash, email_verified) VALUES
('c0000000-0000-0000-0000-000000000002', 'demo@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.rE3W4CQJqPzHPa', TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO profiles (user_id, full_name, email, phone, company_name, country, registration_status) VALUES
('c0000000-0000-0000-0000-000000000002', 'Demo Client', 'demo@example.com', '+1987654321', 'Demo Company Inc.', 'United States', 'approved')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO user_roles (user_id, role) VALUES
('c0000000-0000-0000-0000-000000000002', 'client')
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================
-- Insert Sample Portfolio Projects
-- ============================================
INSERT INTO portfolio_projects (title, slug, description, short_description, category, technologies, base_price, is_featured, is_active, display_order) VALUES
('E-Commerce Platform', 'e-commerce-platform', 'A complete e-commerce solution with payment integration, inventory management, and analytics dashboard.', 'Full-featured online store solution', 'E-Commerce', ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'], 5000.00, TRUE, TRUE, 1),
('Healthcare Management', 'healthcare-management', 'Patient management system with appointment scheduling, medical records, and billing integration.', 'Complete healthcare management solution', 'Healthcare', ARRAY['React', 'Express', 'MongoDB', 'HIPAA Compliant'], 8000.00, TRUE, TRUE, 2),
('Real Estate Portal', 'real-estate-portal', 'Property listing platform with virtual tours, agent management, and lead tracking.', 'Modern property listing platform', 'Real Estate', ARRAY['Next.js', 'PostgreSQL', 'AWS', 'MapBox'], 6500.00, TRUE, TRUE, 3),
('Learning Management System', 'learning-management-system', 'Complete LMS with course creation, student tracking, and certification management.', 'Online education platform', 'Education', ARRAY['React', 'Django', 'PostgreSQL', 'AWS S3'], 7000.00, FALSE, TRUE, 4),
('Restaurant POS System', 'restaurant-pos-system', 'Point of sale system with inventory, staff management, and analytics.', 'Restaurant management solution', 'Hospitality', ARRAY['React', 'Node.js', 'MongoDB', 'Square API'], 4500.00, FALSE, TRUE, 5)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Insert Sample Blog Posts
-- ============================================
INSERT INTO blog_posts (author_id, title, slug, excerpt, content, category, tags, status, published_at) VALUES
('a0000000-0000-0000-0000-000000000001', 'Getting Started with Modern Web Development', 'getting-started-modern-web-development', 'Learn the fundamentals of modern web development with React, TypeScript, and Node.js.', 'Full article content here...', 'Development', ARRAY['React', 'TypeScript', 'Tutorial'], 'published', NOW()),
('a0000000-0000-0000-0000-000000000001', 'Best Practices for Database Design', 'best-practices-database-design', 'Explore proven strategies for designing scalable and efficient databases.', 'Full article content here...', 'Database', ARRAY['MySQL', 'PostgreSQL', 'Design'], 'published', NOW()),
('a0000000-0000-0000-0000-000000000001', 'Securing Your API Endpoints', 'securing-api-endpoints', 'Essential security practices for protecting your REST and GraphQL APIs.', 'Full article content here...', 'Security', ARRAY['API', 'Security', 'JWT'], 'published', NOW())
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Verification Queries
-- ============================================
SELECT '=== SEED DATA VERIFICATION ===' AS info;

SELECT 'Services' AS table_name, COUNT(*) AS count FROM services
UNION ALL
SELECT 'Categories', COUNT(*) FROM project_categories
UNION ALL
SELECT 'Tiers', COUNT(*) FROM project_tiers
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Profiles', COUNT(*) FROM profiles
UNION ALL
SELECT 'User Roles', COUNT(*) FROM user_roles
UNION ALL
SELECT 'Portfolio', COUNT(*) FROM portfolio_projects
UNION ALL
SELECT 'Blog Posts', COUNT(*) FROM blog_posts;

-- ============================================
-- Default Login Credentials
-- ============================================
SELECT '=== DEFAULT CREDENTIALS ===' AS info;
SELECT 'Admin' AS role, 'admin@abit.solutions' AS email, 'Admin@123' AS password
UNION ALL
SELECT 'Client', 'demo@example.com', 'Client@123';
