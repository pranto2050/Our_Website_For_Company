-- ============================================
-- ABIT Solutions - Complete MySQL Database Schema
-- Compatible with XAMPP/MySQL 8.0+
-- Database Name: abit_solutions
-- Version: 2.0 (Complete with Categories, Tiers, Payments)
-- ============================================

-- ============================================
-- STEP 1: Create Database
-- ============================================
DROP DATABASE IF EXISTS abit_solutions;
CREATE DATABASE abit_solutions CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE abit_solutions;

-- ============================================
-- ENUM TYPES (MySQL uses ENUM directly in columns)
-- ============================================
-- app_role: 'admin', 'client'
-- registration_status: 'pending', 'approved', 'rejected', 'suspended'
-- project_status: 'pending', 'in_progress', 'completed', 'cancelled'
-- project_tier: 'basic', 'normal', 'premium'
-- ticket_priority: 'low', 'medium', 'high', 'urgent'
-- ticket_status: 'open', 'in_progress', 'resolved', 'closed'
-- payment_status: 'pending', 'completed', 'failed', 'rejected'
-- payment_type: 'bank_transfer', 'credit_card', 'paypal', 'cash', 'crypto', 'other'

-- ============================================
-- SEQUENCE for Ticket Numbers
-- ============================================
CREATE TABLE ticket_number_seq (
    id INT AUTO_INCREMENT PRIMARY KEY
) ENGINE=InnoDB;

-- ============================================
-- TABLE: users (Authentication)
-- ============================================
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_reset_token (reset_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: profiles (User Information)
-- ============================================
CREATE TABLE profiles (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company_name VARCHAR(255),
    country VARCHAR(100),
    timezone VARCHAR(100),
    services_interested JSON DEFAULT ('[]'),
    project_description TEXT,
    avatar_url VARCHAR(500),
    registration_status ENUM('pending', 'approved', 'rejected', 'suspended') DEFAULT 'pending',
    status_updated_at TIMESTAMP NULL,
    status_updated_by CHAR(36),
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_profiles_user_id (user_id),
    INDEX idx_profiles_email (email),
    INDEX idx_profiles_status (registration_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: user_roles (Role Management)
-- ============================================
CREATE TABLE user_roles (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    role ENUM('admin', 'client') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_role (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_roles_user_id (user_id),
    INDEX idx_user_roles_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: services (Available Services)
-- ============================================
CREATE TABLE services (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_services_slug (slug),
    INDEX idx_services_active (is_active),
    INDEX idx_services_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: project_categories (Project Types)
-- ============================================
CREATE TABLE project_categories (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    base_delivery_days INT NOT NULL DEFAULT 30,
    deposit_percentage INT NOT NULL DEFAULT 30,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_categories_slug (slug),
    INDEX idx_categories_active (is_active),
    INDEX idx_categories_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: project_tiers (Service Levels)
-- ============================================
CREATE TABLE project_tiers (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tier_key VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'Star',
    color_from VARCHAR(50) DEFAULT 'slate-500',
    color_to VARCHAR(50) DEFAULT 'slate-600',
    features JSON DEFAULT ('[]'),
    price_multiplier DECIMAL(4,2) NOT NULL DEFAULT 1.00,
    delivery_multiplier DECIMAL(4,2) NOT NULL DEFAULT 1.00,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tiers_key (tier_key),
    INDEX idx_tiers_active (is_active),
    INDEX idx_tiers_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: projects (Client Projects)
-- ============================================
CREATE TABLE projects (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    client_id CHAR(36) NOT NULL,
    category_id CHAR(36),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    service_type VARCHAR(100),
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    tier ENUM('basic', 'normal', 'premium') DEFAULT 'normal',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    budget DECIMAL(12, 2),
    total_amount DECIMAL(12, 2),
    deposit_amount DECIMAL(12, 2),
    delivery_days INT,
    features JSON DEFAULT ('[]'),
    image_url VARCHAR(500),
    start_date DATE,
    due_date DATE,
    completed_at TIMESTAMP NULL,
    assigned_to CHAR(36),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES project_categories(id) ON DELETE SET NULL,
    INDEX idx_projects_client_id (client_id),
    INDEX idx_projects_category_id (category_id),
    INDEX idx_projects_status (status),
    INDEX idx_projects_tier (tier),
    INDEX idx_projects_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: payments (Payment Records)
-- ============================================
CREATE TABLE payments (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    client_id CHAR(36) NOT NULL,
    project_id CHAR(36),
    amount DECIMAL(12, 2) NOT NULL,
    payment_type ENUM('bank_transfer', 'credit_card', 'paypal', 'cash', 'crypto', 'other') DEFAULT 'bank_transfer',
    status ENUM('pending', 'completed', 'failed', 'rejected') DEFAULT 'pending',
    transaction_id VARCHAR(255),
    notes TEXT,
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    INDEX idx_payments_client_id (client_id),
    INDEX idx_payments_project_id (project_id),
    INDEX idx_payments_status (status),
    INDEX idx_payments_type (payment_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: support_tickets (Support System)
-- ============================================
CREATE TABLE support_tickets (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    client_id CHAR(36) NOT NULL,
    project_id CHAR(36),
    ticket_number VARCHAR(50) NOT NULL UNIQUE,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    assigned_to CHAR(36),
    resolved_at TIMESTAMP NULL,
    closed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    INDEX idx_tickets_client_id (client_id),
    INDEX idx_tickets_project_id (project_id),
    INDEX idx_tickets_status (status),
    INDEX idx_tickets_priority (priority),
    INDEX idx_tickets_number (ticket_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: ticket_messages (Ticket Conversations)
-- ============================================
CREATE TABLE ticket_messages (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    ticket_id CHAR(36) NOT NULL,
    sender_id CHAR(36) NOT NULL,
    message TEXT NOT NULL,
    attachments JSON DEFAULT ('[]'),
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_messages_ticket_id (ticket_id),
    INDEX idx_messages_sender_id (sender_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: notifications (User Notifications)
-- ============================================
CREATE TABLE notifications (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notifications_user_id (user_id),
    INDEX idx_notifications_read (is_read),
    INDEX idx_notifications_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: blog_posts (Blog System)
-- ============================================
CREATE TABLE blog_posts (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    author_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content LONGTEXT,
    featured_image VARCHAR(500),
    category VARCHAR(100),
    tags JSON DEFAULT ('[]'),
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_blog_slug (slug),
    INDEX idx_blog_status (status),
    INDEX idx_blog_author (author_id),
    INDEX idx_blog_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: portfolio_projects (Showcase Projects)
-- ============================================
CREATE TABLE portfolio_projects (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    short_description VARCHAR(500),
    image_url VARCHAR(500),
    demo_url VARCHAR(500),
    category VARCHAR(100),
    technologies JSON DEFAULT ('[]'),
    base_price DECIMAL(12, 2),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_portfolio_slug (slug),
    INDEX idx_portfolio_category (category),
    INDEX idx_portfolio_featured (is_featured),
    INDEX idx_portfolio_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TRIGGER: Auto-generate Ticket Number
-- ============================================
DELIMITER //
CREATE TRIGGER before_ticket_insert
BEFORE INSERT ON support_tickets
FOR EACH ROW
BEGIN
    DECLARE next_num INT;
    INSERT INTO ticket_number_seq VALUES (NULL);
    SET next_num = LAST_INSERT_ID();
    SET NEW.ticket_number = CONCAT('ABIT-', LPAD(next_num, 6, '0'));
END//
DELIMITER ;

-- ============================================
-- TRIGGER: Update profile updated_at
-- ============================================
DELIMITER //
CREATE TRIGGER before_profile_update
BEFORE UPDATE ON profiles
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//
DELIMITER ;

-- ============================================
-- VIEWS
-- ============================================

-- View: Active Projects Summary
CREATE VIEW v_active_projects AS
SELECT 
    p.id,
    p.title,
    p.status,
    p.tier,
    p.priority,
    p.total_amount,
    p.due_date,
    pr.full_name AS client_name,
    pr.email AS client_email,
    pc.name AS category_name
FROM projects p
JOIN profiles pr ON p.client_id = pr.user_id
LEFT JOIN project_categories pc ON p.category_id = pc.id
WHERE p.status IN ('pending', 'in_progress');

-- View: Dashboard Stats
CREATE VIEW v_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM users) AS total_users,
    (SELECT COUNT(*) FROM projects) AS total_projects,
    (SELECT COUNT(*) FROM projects WHERE status = 'in_progress') AS active_projects,
    (SELECT COUNT(*) FROM support_tickets WHERE status = 'open') AS open_tickets,
    (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'completed') AS total_revenue,
    (SELECT COUNT(*) FROM profiles WHERE registration_status = 'pending') AS pending_registrations;

-- ============================================
-- DISPLAY TABLES
-- ============================================
SHOW TABLES;
