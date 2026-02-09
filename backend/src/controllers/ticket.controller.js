// ============================================
// Support Ticket Controller
// ============================================

const pool = require('../config/database');

// Get user's tickets
exports.getMyTickets = async (req, res) => {
  try {
    const [tickets] = await pool.query(
      'SELECT * FROM support_tickets WHERE client_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(tickets);
  } catch (err) {
    console.error('Get tickets error:', err);
    res.status(500).json({ error: 'Failed to get tickets' });
  }
};

// Get ticket with messages
exports.getTicketById = async (req, res) => {
  try {
    const [tickets] = await pool.query(
      'SELECT * FROM support_tickets WHERE id = ? AND client_id = ?',
      [req.params.id, req.user.id]
    );

    if (tickets.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Get messages (non-internal only for clients)
    const [messages] = await pool.query(
      `SELECT tm.*, p.full_name as sender_name
       FROM ticket_messages tm
       LEFT JOIN profiles p ON tm.sender_id = p.user_id
       WHERE tm.ticket_id = ? AND tm.is_internal = false
       ORDER BY tm.created_at`,
      [req.params.id]
    );

    // Parse attachments
    messages.forEach(msg => {
      if (msg.attachments) {
        msg.attachments = JSON.parse(msg.attachments);
      }
    });

    res.json({ ...tickets[0], messages });
  } catch (err) {
    console.error('Get ticket error:', err);
    res.status(500).json({ error: 'Failed to get ticket' });
  }
};

// Create ticket
exports.createTicket = async (req, res) => {
  const { subject, description, project_id, priority } = req.body;
  const ticket_number = `TKT-${Date.now()}`;

  try {
    const [result] = await pool.query(
      `INSERT INTO support_tickets (client_id, ticket_number, subject, description, project_id, priority)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, ticket_number, subject, description, project_id, priority || 'medium']
    );

    res.status(201).json({ 
      id: result.insertId, 
      ticket_number,
      message: 'Ticket created successfully' 
    });
  } catch (err) {
    console.error('Create ticket error:', err);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
};

// Add message to ticket
exports.addMessage = async (req, res) => {
  const { message, attachments } = req.body;

  try {
    // Verify ticket belongs to user
    const [tickets] = await pool.query(
      'SELECT id FROM support_tickets WHERE id = ? AND client_id = ?',
      [req.params.id, req.user.id]
    );

    if (tickets.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    await pool.query(
      'INSERT INTO ticket_messages (ticket_id, sender_id, message, attachments) VALUES (?, ?, ?, ?)',
      [req.params.id, req.user.id, message, JSON.stringify(attachments || [])]
    );

    // Update ticket timestamp
    await pool.query(
      'UPDATE support_tickets SET updated_at = NOW() WHERE id = ?',
      [req.params.id]
    );

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('Add message error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
};
