const { generateToken } = require("./tokens");

function generatePayload(data) {
  const payload = {
    name: data.name,
    lastName: data.lastName,
    email: data.email,
    type: data.type,
    role: data.role,
    addressName: data.addressName || "",
    addressCoor: data.addressCoor || {},
    geoLocation: data.geoLocation || {},
    picture: data.picture || "",
    office: data.office || "",
    activeReports: data.activeReports || 0,
    issuerMessages: data.issuerMessages,
    solverMessages: data.solverMessages,
  };
  const token = generateToken(payload);
  return { token, payload };
}

module.exports = { generatePayload };
