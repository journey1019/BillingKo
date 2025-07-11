// utils/permissionUtils.js
import { PERMISSIONS } from '@/constants/permissions';

export const hasPermission = (action, role) => {
    const allowedRoles = PERMISSIONS[action] || [];
    return allowedRoles.includes(role);
};

export const hasStepPermission = (stepKey, role) => {
    const allowedRoles = PERMISSIONS.stepAccess[stepKey] || [];
    return allowedRoles.includes(role);
};