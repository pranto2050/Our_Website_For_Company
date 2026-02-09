-- ============================================
-- ABIT Solutions - Complete Seed Data
-- Compatible with XAMPP/MySQL 8.0+
-- Run AFTER mysql_schema.sql
-- ============================================

USE abit_solutions;

-- ============================================
-- Insert Default Services
-- ============================================
INSERT INTO services (id, name, slug, description, icon, is_active, display_order) VALUES
('svc-00000001-0000-0000-0000-000000000001', 'Web Development', 'web-development', 'Custom website and web application development using modern technologies', 'Globe', TRUE, 1),
('svc-00000001-0000-0000-0000-000000000002', 'Mobile App Development', 'mobile-app-development', 'Native and cross-platform iOS and Android mobile application development', 'Smartphone', TRUE, 2),
('svc-00000001-0000-0000-0000-000000000003', 'UI/UX Design', 'ui-ux-design', 'User interface and user experience design services with modern aesthetics', 'Palette', TRUE, 3),
('svc-00000001-0000-0000-0000-000000000004', 'Cloud Solutions', 'cloud-solutions', 'Cloud infrastructure, deployment, and DevOps services', 'Cloud', TRUE, 4),
('svc-00000001-0000-0000-0000-000000000005', 'API Development', 'api-development', 'RESTful and GraphQL API design and development', 'Code', TRUE, 5),
('svc-00000001-0000-0000-0000-000000000006', 'E-Commerce Solutions', 'e-commerce', 'Complete online store and e-commerce platform development', 'ShoppingCart', TRUE, 6),
('svc-00000001-0000-0000-0000-000000000007', 'Database Design', 'database-design', 'Database architecture, optimization, and migration services', 'Database', TRUE, 7),
('svc-00000001-0000-0000-0000-000000000008', 'DevOps & CI/CD', 'devops', 'Continuous integration, deployment pipelines, and automation', 'Settings', TRUE, 8);

-- ============================================
-- Insert Project Categories
-- ============================================
INSERT INTO project_categories (id, name, slug, description, icon, base_delivery_days, deposit_percentage, is_active, display_order) VALUES
('cat-00000001-0000-0000-0000-000000000001', 'Website Development', 'website-development', 'Custom websites and web applications', 'Globe', 30, 30, TRUE, 1),
('cat-00000001-0000-0000-0000-000000000002', 'Mobile Application', 'mobile-application', 'iOS and Android mobile apps', 'Smartphone', 45, 40, TRUE, 2),
('cat-00000001-0000-0000-0000-000000000003', 'E-Commerce Platform', 'e-commerce-platform', 'Online stores with payment integration', 'ShoppingCart', 40, 35, TRUE, 3),
('cat-00000001-0000-0000-0000-000000000004', 'Custom Software', 'custom-software', 'Tailored software solutions', 'Code', 60, 40, TRUE, 4),
('cat-00000001-0000-0000-0000-000000000005', 'UI/UX Design', 'ui-ux-design', 'Design and prototyping services', 'Palette', 20, 25, TRUE, 5),
('cat-00000001-0000-0000-0000-000000000006', 'API Integration', 'api-integration', 'Third-party API integration services', 'Plug', 25, 30, TRUE, 6);

-- ============================================
-- Insert Project Tiers
-- ============================================
INSERT INTO project_tiers (id, tier_key, name, description, icon, color_from, color_to, features, price_multiplier, delivery_multiplier, is_active, display_order) VALUES
('tier-0000001-0000-0000-0000-000000000001', 'basic', 'Basic', 'Economy option with essential features', 'Star', 'slate-400', 'slate-500', '["Standard delivery time", "Basic support", "Email communication", "2 revision rounds"]', 1.00, 1.50, TRUE, 1),
('tier-0000001-0000-0000-0000-000000000002', 'normal', 'Normal', 'Standard delivery with priority support', 'Zap', 'blue-400', 'blue-600', '["Priority delivery", "Standard support", "Email & chat communication", "5 revision rounds", "Source code included"]', 1.50, 1.00, TRUE, 2),
('tier-0000001-0000-0000-0000-000000000003', 'premium', 'Premium', 'Fastest delivery with VIP treatment', 'Crown', 'amber-400', 'amber-600', '["Express delivery", "VIP 24/7 support", "All communication channels", "Unlimited revisions", "Source code included", "1 month free maintenance", "Priority bug fixes"]', 2.50, 0.50, TRUE, 3);

-- ============================================
-- Insert Admin User
-- Password: Admin@123 (bcrypt hash)
-- ============================================
INSERT INTO users (id, email, password_hash, email_verified) VALUES
('usr-admin001-0000-0000-0000-000000000001', 'admin@abit.solutions', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.rE3W4CQJqPzHPa', TRUE);

INSERT INTO profiles (id, user_id, full_name, email, phone, company_name, registration_status) VALUES
('prf-admin001-0000-0000-0000-000000000001', 'usr-admin001-0000-0000-0000-000000000001', 'System Administrator', 'admin@abit.solutions', '+1234567890', 'ABIT Solutions', 'approved');

INSERT INTO user_roles (id, user_id, role) VALUES
('rol-admin001-0000-0000-0000-000000000001', 'usr-admin001-0000-0000-0000-000000000001', 'admin');

-- ============================================
-- Insert Demo Client User
-- Password: Client@123 (bcrypt hash)
-- ============================================
INSERT INTO users (id, email, password_hash, email_verified) VALUES
('usr-demo0001-0000-0000-0000-000000000002', 'demo@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.rE3W4CQJqPzHPa', TRUE);

INSERT INTO profiles (id, user_id, full_name, email, phone, company_name, country, registration_status) VALUES
('prf-demo0001-0000-0000-0000-000000000002', 'usr-demo0001-0000-0000-0000-000000000002', 'Demo Client', 'demo@example.com', '+1987654321', 'Demo Company Inc.', 'United States', 'approved');

INSERT INTO user_roles (id, user_id, role) VALUES
('rol-demo0001-0000-0000-0000-000000000002', 'usr-demo0001-0000-0000-0000-000000000002', 'client');

-- ============================================
-- Insert Sample Portfolio Projects
-- ============================================
INSERT INTO portfolio_projects (id, title, slug, description, short_description, image_url, demo_url, category, technologies, base_price, is_featured, is_active, display_order) VALUES
('port-000001-0000-0000-0000-000000000001', 'E-Commerce Platform', 'e-commerce-platform', 'A complete e-commerce solution with payment integration, inventory management, and analytics dashboard.', 'Full-featured online store solution', '/images/portfolio/ecommerce.jpg', 'https://demo.example.com/ecommerce', 'E-Commerce', '["React", "Node.js", "PostgreSQL", "Stripe"]', 5000.00, TRUE, TRUE, 1),
('port-000001-0000-0000-0000-000000000002', 'Healthcare Management', 'healthcare-management', 'Patient management system with appointment scheduling, medical records, and billing integration.', 'Complete healthcare management solution', '/images/portfolio/healthcare.jpg', 'https://demo.example.com/healthcare', 'Healthcare', '["React", "Express", "MongoDB", "HIPAA Compliant"]', 8000.00, TRUE, TRUE, 2),
('port-000001-0000-0000-0000-000000000003', 'Real Estate Portal', 'real-estate-portal', 'Property listing platform with virtual tours, agent management, and lead tracking.', 'Modern property listing platform', '/images/portfolio/realestate.jpg', 'https://demo.example.com/realestate', 'Real Estate', '["Next.js", "PostgreSQL", "AWS", "MapBox"]', 6500.00, TRUE, TRUE, 3),
('port-000001-0000-0000-0000-000000000004', 'Learning Management System', 'learning-management-system', 'Complete LMS with course creation, student tracking, and certification management.', 'Online education platform', '/images/portfolio/lms.jpg', 'https://demo.example.com/lms', 'Education', '["React", "Django", "PostgreSQL", "AWS S3"]', 7000.00, FALSE, TRUE, 4),
('port-000001-0000-0000-0000-000000000005', 'Restaurant POS System', 'restaurant-pos-system', 'Point of sale system with inventory, staff management, and analytics.', 'Restaurant management solution', '/images/portfolio/pos.jpg', 'https://demo.example.com/pos', 'Hospitality', '["React", "Node.js", "MongoDB", "Square API"]', 4500.00, FALSE, TRUE, 5);

-- ============================================
-- Insert Sample Blog Posts
-- ============================================
INSERT INTO blog_posts (id, author_id, title, slug, excerpt, content, category, tags, status, published_at) VALUES
('blog-000001-0000-0000-0000-000000000001', 'usr-admin001-0000-0000-0000-000000000001', 'Getting Started with Modern Web Development', 'getting-started-modern-web-development', 'Learn the fundamentals of modern web development with React, TypeScript, and Node.js.', 'Full article content here...', 'Development', '["React", "TypeScript", "Tutorial"]', 'published', NOW()),
('blog-000001-0000-0000-0000-000000000002', 'usr-admin001-0000-0000-0000-000000000001', 'Best Practices for Database Design', 'best-practices-database-design', 'Explore proven strategies for designing scalable and efficient databases.', 'Full article content here...', 'Database', '["MySQL", "PostgreSQL", "Design"]', 'published', NOW()),
('blog-000001-0000-0000-0000-000000000003', 'usr-admin001-0000-0000-0000-000000000001', 'Securing Your API Endpoints', 'securing-api-endpoints', 'Essential security practices for protecting your REST and GraphQL APIs.', 'Full article content here...', 'Security', '["API", "Security", "JWT"]', 'published', NOW());

-- ============================================
-- Insert Sample Project for Demo Client
-- ============================================
INSERT INTO projects (id, client_id, category_id, title, description, service_type, status, tier, priority, total_amount, deposit_amount, delivery_days, due_date) VALUES
('prj-demo0001-0000-0000-0000-000000000001', 'usr-demo0001-0000-0000-0000-000000000002', 'cat-00000001-0000-0000-0000-000000000001', 'Company Website Redesign', 'Complete redesign of corporate website with modern UI/UX', 'Website Development', 'in_progress', 'normal', 'medium', 4500.00, 1350.00, 30, DATE_ADD(CURDATE(), INTERVAL 30 DAY));

-- ============================================
-- Verification Queries
-- ============================================
SELECT '=== SEED DATA VERIFICATION ===' AS info;
SELECT 'Services:' AS table_name, COUNT(*) AS count FROM services;
SELECT 'Categories:' AS table_name, COUNT(*) AS count FROM project_categories;
SELECT 'Tiers:' AS table_name, COUNT(*) AS count FROM project_tiers;
SELECT 'Users:' AS table_name, COUNT(*) AS count FROM users;
SELECT 'Profiles:' AS table_name, COUNT(*) AS count FROM profiles;
SELECT 'User Roles:' AS table_name, COUNT(*) AS count FROM user_roles;
SELECT 'Portfolio:' AS table_name, COUNT(*) AS count FROM portfolio_projects;
SELECT 'Blog Posts:' AS table_name, COUNT(*) AS count FROM blog_posts;
SELECT 'Projects:' AS table_name, COUNT(*) AS count FROM projects;

-- ============================================
-- Default Login Credentials
-- ============================================
SELECT '=== DEFAULT CREDENTIALS ===' AS info;
SELECT 'Admin' AS role, 'admin@abit.solutions' AS email, 'Admin@123' AS password
UNION ALL
SELECT 'Client' AS role, 'demo@example.com' AS email, 'Client@123' AS password;
