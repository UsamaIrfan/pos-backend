import { AuthRequest } from "../types/request";

import { ROLES } from "./enums";

const isCompanyOwner = (req: AuthRequest) => {
  return (
    req?.user?.roles?.includes(ROLES.COMPANY_OWNER) &&
    req?.user?.roles?.includes(ROLES.SUPER_ADMIN)
  );
};

const commonUtils = { isCompanyOwner };

export default commonUtils;
