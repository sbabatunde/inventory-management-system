// src/modules/release-form/constants/index.ts

import {
  ReleaseCategory,
  ReleaseStatus,
  DestinationType,
  SignatoryRole,
} from "../types";

export const RELEASE_CATEGORIES: Array<{
  value: ReleaseCategory;
  label: string;
  color: string;
}> = [
  { value: "installation", label: "Installation", color: "blue" },
  { value: "maintenance", label: "Maintenance", color: "amber" },
  { value: "others", label: "Others", color: "purple" },
];

export const RELEASE_CATEGORY_MAP = RELEASE_CATEGORIES.reduce(
  (acc, category) => {
    acc[category.value] = category;
    return acc;
  },
  {} as Record<ReleaseCategory, (typeof RELEASE_CATEGORIES)[0]>,
);

export const RELEASE_STATUSES: Array<{
  value: ReleaseStatus;
  label: string;
  color: string;
}> = [
  { value: "draft", label: "Draft", color: "neutral" },
  { value: "pending_approval", label: "Pending Approval", color: "amber" },
  { value: "approved", label: "Approved", color: "green" },
  { value: "dispatched", label: "Dispatched", color: "blue" },
  { value: "completed", label: "Completed", color: "purple" },
  { value: "rejected", label: "Rejected", color: "red" },
  { value: "cancelled", label: "Cancelled", color: "red" },
  {
    value: "pending_reconciliation",
    label: "Pending Reconciliation",
    color: "orange",
  },
];

export const RELEASE_STATUS_MAP = RELEASE_STATUSES.reduce(
  (acc, status) => {
    acc[status.value] = status;
    return acc;
  },
  {} as Record<ReleaseStatus, (typeof RELEASE_STATUSES)[0]>,
);

export const DESTINATION_TYPES: Array<{
  value: DestinationType;
  label: string;
}> = [
  { value: "CPE", label: "Customer Premises Equipment" },
  { value: "NOC", label: "Network Operations Center" },
  { value: "POP", label: "Point of Presence" },
  { value: "Other", label: "Other" },
];

export const SIGNATORY_ROLES: Array<{ value: SignatoryRole; label: string }> = [
  { value: "requester", label: "Requester" },
  { value: "storekeeper", label: "Storekeeper" },
  { value: "engineer", label: "Engineer" },
  { value: "approver", label: "Approver" },
  { value: "receiver", label: "Receiver" },
];
