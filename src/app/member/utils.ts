export function getRoleLabel(role: string) {
  switch (role) {
    case "default-roles-pilot-dev":
      return "Member";
    case "org-admin":
      return "Admin";
    default:
      return role;
  }
}
