const { validate: isUuid } = require('uuid');

const validateSqlUuid = (id) => {
    // Convert to lowercase before validation and usage
    const lowerCaseId = id.toLowerCase();

    // Check if the lowercased UUID is valid
    if (!isUuid(lowerCaseId)) {
        throw new Error("Invalid UUID format.");
    }

    return lowerCaseId;  // Return the corrected UUID
};

module.exports = validateSqlUuid;
