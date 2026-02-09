// ============================================
// Payment Controller
// ============================================

const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Get user's payments
exports.getMyPayments = async (req, res) => {
  try {
    const [payments] = await pool.query(
      `SELECT p.*, pr.title as project_title 
       FROM payments p
       LEFT JOIN projects pr ON p.project_id = pr.id
       WHERE p.client_id = ? 
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );
    res.json(payments);
  } catch (err) {
    console.error('Get payments error:', err);
    res.status(500).json({ error: 'Failed to get payments' });
  }
};

// Get single payment
exports.getPaymentById = async (req, res) => {
  try {
    const [payments] = await pool.query(
      `SELECT p.*, pr.title as project_title 
       FROM payments p
       LEFT JOIN projects pr ON p.project_id = pr.id
       WHERE p.id = ? AND p.client_id = ?`,
      [req.params.id, req.user.id]
    );

    if (payments.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payments[0]);
  } catch (err) {
    console.error('Get payment error:', err);
    res.status(500).json({ error: 'Failed to get payment' });
  }
};

// Create payment (for project order)
exports.createPayment = async (req, res) => {
  const { project_id, amount, payment_type, transaction_id, notes } = req.body;

  try {
    const paymentId = uuidv4();
    
    await pool.query(
      `INSERT INTO payments 
       (id, client_id, project_id, amount, payment_type, transaction_id, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [paymentId, req.user.id, project_id, amount, payment_type || 'credit_card', transaction_id, notes]
    );

    res.status(201).json({ 
      id: paymentId, 
      message: 'Payment created successfully' 
    });
  } catch (err) {
    console.error('Create payment error:', err);
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

// Process payment (simulate payment processing)
exports.processPayment = async (req, res) => {
  const { payment_id, card_number, card_holder, cvv, expiry_month, expiry_year } = req.body;

  try {
    // Validate card details (basic validation)
    if (!card_number || card_number.length < 16) {
      return res.status(400).json({ error: 'Invalid card number' });
    }

    if (!cvv || cvv.length < 3) {
      return res.status(400).json({ error: 'Invalid CVV' });
    }

    // Check if payment exists and belongs to user
    const [payments] = await pool.query(
      'SELECT * FROM payments WHERE id = ? AND client_id = ?',
      [payment_id, req.user.id]
    );

    if (payments.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Simulate payment processing
    const transactionId = 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Update payment status
    await pool.query(
      `UPDATE payments 
       SET status = 'completed', transaction_id = ?, paid_at = NOW(), updated_at = NOW()
       WHERE id = ?`,
      [transactionId, payment_id]
    );

    // Update project if payment is for a project
    const payment = payments[0];
    if (payment.project_id) {
      await pool.query(
        `UPDATE projects 
         SET status = 'in_progress', start_date = CURDATE(), updated_at = NOW()
         WHERE id = ?`,
        [payment.project_id]
      );
    }

    res.json({ 
      message: 'Payment processed successfully',
      transaction_id: transactionId
    });
  } catch (err) {
    console.error('Process payment error:', err);
    res.status(500).json({ error: 'Failed to process payment' });
  }
};

// Admin: Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const { status, payment_type, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT p.*, pr.title as project_title, pf.full_name as client_name, pf.email as client_email
       FROM payments p
       LEFT JOIN projects pr ON p.project_id = pr.id
       LEFT JOIN profiles pf ON p.client_id = pf.user_id
       WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND p.status = ?';
      params.push(status);
    }

    if (payment_type) {
      query += ' AND p.payment_type = ?';
      params.push(payment_type);
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [payments] = await pool.query(query, params);
    
    // Get total count
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM payments');
    
    res.json({
      payments,
      total: countResult[0].total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (err) {
    console.error('Admin get payments error:', err);
    res.status(500).json({ error: 'Failed to get payments' });
  }
};

// Admin: Update payment status
exports.updatePaymentStatus = async (req, res) => {
  const { status, notes } = req.body;

  try {
    const updateFields = ['status = ?', 'updated_at = NOW()'];
    const params = [status];

    if (notes) {
      updateFields.push('notes = ?');
      params.push(notes);
    }

    if (status === 'completed') {
      updateFields.push('paid_at = NOW()');
    }

    params.push(req.params.id);

    const [result] = await pool.query(
      `UPDATE payments SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ message: 'Payment updated successfully' });
  } catch (err) {
    console.error('Update payment error:', err);
    res.status(500).json({ error: 'Failed to update payment' });
  }
};

// Get payment statistics
exports.getPaymentStats = async (req, res) => {
  try {
    const [stats] = await pool.query(`
      SELECT 
        COUNT(*) as total_payments,
        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_revenue,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_amount,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_count
      FROM payments
    `);

    res.json(stats[0]);
  } catch (err) {
    console.error('Get payment stats error:', err);
    res.status(500).json({ error: 'Failed to get payment statistics' });
  }
};
