const logger = require('../logging/logger');

// Example roles and permissions structure (this could be stored in a database in a production system)
const permissions = {
    user: {
        canView: ['contracts:read'],
        canExecute: []
    },
    admin: {
        canView: ['contracts:read', 'contracts:write', 'contracts:execute'],
        canExecute: ['contracts:execute']
    },
    node: {
        canView: ['contracts:read'],
        canExecute: ['contracts:execute']
    }
};

// Function to check if a role has the permission to perform a specific action
const checkRoleAccess = (roles, action) => {
    try {
        for (const role of roles) {
            const rolePermissions = permissions[role];
            if (rolePermissions && (rolePermissions.canView.includes(action) || rolePermissions.canExecute.includes(action))) {
                logger.info(`[AUTHORIZATION] Access granted for role ${role} to perform action ${action}.`);
                return true;
            }
        }
        logger.warn(`[AUTHORIZATION] Access denied. None of the roles (${roles.join(', ')}) have permission for action ${action}.`);
        return false;
    } catch (error) {
        logger.error(`[AUTHORIZATION ERROR] Error checking access for roles (${roles.join(', ')}): ${error.message}`);
        return false;
    }
};

// Function to authorize a user to view a contract
const canViewContract = (user, contract) => {
    const action = 'contracts:read';
    const hasAccess = checkRoleAccess(user.roles, action);
    if (hasAccess) {
        logger.info(`[AUTHORIZATION] User ${user.username} authorized to view contract ${contract.id}.`);
    } else {
        logger.warn(`[AUTHORIZATION] User ${user.username} is not authorized to view contract ${contract.id}.`);
    }
    return hasAccess;
};

// Function to authorize a user to execute a contract
const canExecuteContract = (user, contract) => {
    const action = 'contracts:execute';
    const hasAccess = checkRoleAccess(user.roles, action);
    if (hasAccess) {
        logger.info(`[AUTHORIZATION] User ${user.username} authorized to execute contract ${contract.id}.`);
    } else {
        logger.warn(`[AUTHORIZATION] User ${user.username} is not authorized to execute contract ${contract.id}.`);
    }
    return hasAccess;
};

// Function to authorize a node to execute a contract
const canNodeExecuteContract = (node, contract) => {
    const action = 'contracts:execute';
    const hasAccess = checkRoleAccess(node.roles, action);
    if (hasAccess) {
        logger.info(`[AUTHORIZATION] Node ${node.id} authorized to execute contract ${contract.id}.`);
    } else {
        logger.warn(`[AUTHORIZATION] Node ${node.id} is not authorized to execute contract ${contract.id}.`);
    }
    return hasAccess;
};

// Function to add a new role with specific permissions (for dynamic role management)
const addRole = (roleName, permissionsObject) => {
    if (permissions[roleName]) {
        logger.warn(`[AUTHORIZATION] Role ${roleName} already exists.`);
        return false;
    }

    permissions[roleName] = permissionsObject;
    logger.info(`[AUTHORIZATION] Role ${roleName} added successfully.`);
    return true;
};

// Function to update permissions for an existing role
const updateRolePermissions = (roleName, updatedPermissions) => {
    if (!permissions[roleName]) {
        logger.warn(`[AUTHORIZATION] Role ${roleName} does not exist.`);
        return false;
    }

    permissions[roleName] = updatedPermissions;
    logger.info(`[AUTHORIZATION] Permissions for role ${roleName} updated successfully.`);
    return true;
};

// Function to remove a role
const removeRole = (roleName) => {
    if (!permissions[roleName]) {
        logger.warn(`[AUTHORIZATION] Role ${roleName} does not exist.`);
        return false;
    }

    delete permissions[roleName];
    logger.info(`[AUTHORIZATION] Role ${roleName} removed successfully.`);
    return true;
};

module.exports = {
    checkRoleAccess,
    canViewContract,
    canExecuteContract,
    canNodeExecuteContract,
    addRole,
    updateRolePermissions,
    removeRole
};
