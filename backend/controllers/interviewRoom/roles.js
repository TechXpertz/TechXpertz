const pool = require('../../db');

const firstRole = (bookingId, other) => {
  if (bookingId < other) {
    return 'interviewee';
  } else {
    return 'interviewer';
  }
};

const secondRole = (bookingId, other) => {
  if (bookingId < other) {
    return 'interviewer';
  } else {
    return 'interviewee';
  }
};

const hasSwitched = async (bookingId, role) => {
  const other = await getOtherBookingId(bookingId);
  return firstRole(bookingId, other) !== role;
};

const getOtherBookingId = async bookingId => {
  const other = await pool.query(
    'SELECT other_booking_id FROM bookings WHERE booking_id = $1',
    [bookingId]
  );
  return other.rows[0].other_booking_id;
};

const getCurrentRole = async bookingId => {
  const role = await pool.query(
    'SELECT role FROM bookings WHERE booking_id = $1',
    [bookingId]
  );
  if (role.rowCount === 0) {
    return undefined;
  } else {
    return role.rows[0].role;
  }
};

const updateRole = async (bookingId, role) => {
  pool.query(
    'UPDATE bookings SET role = $1 WHERE booking_id = $2',
    [role, bookingId]
  );
};

const getOrInsertRole = async (bookingId, role) => {
  const current = await getCurrentRole(bookingId);
  if (!current) {
    updateRole(bookingId, role);
    return {
      role,
      hasSwitched: false
    };
  } else {
    const switched = await hasSwitched(bookingId, current);
    return {
      role: current,
      hasSwitched: switched
    };
  }
};

const switchRoles = async (bookingId) => {
  const other = await getOtherBookingId(bookingId);
  const bookingRole = secondRole(bookingId, other);
  const otherRole = secondRole(other, bookingId);
  updateRole(bookingId, bookingRole);
  updateRole(other, otherRole);
};

const hasUserSwitched = async bookingId => {
  const current = await getCurrentRole(bookingId);
  if (!current) {
    return false;
  }
  return hasSwitched(bookingId, current);
}

module.exports = {
  getOrInsertRole,
  switchRoles,
  hasUserSwitched
}