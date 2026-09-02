// src/modules/release-form/components/SignatoryPicker.tsx

import React, { useState, useEffect } from "react";
import { Input, Button, Badge } from "../../../shared/components/UI";
import { crmService } from "../../integration/services/crm.service";
import { showError, showSuccess } from "../../../shared/utils/toast";

interface SignatoryPickerProps {
  signatories: Array<{
    crm_user_id?: number;
    user_id?: number;
    name: string;
    role: string;
    email?: string;
  }>;
  onChange: (signatories: Array<any>) => void;
}

const SignatoryPicker: React.FC<SignatoryPickerProps> = ({
  signatories,
  onChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Array<any>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRole, setSelectedRole] = useState("engineer");

  const roles = [
    { value: "requester", label: "Requester" },
    { value: "storekeeper", label: "Storekeeper" },
    { value: "engineer", label: "Engineer" },
    { value: "approver", label: "Approver" },
    { value: "receiver", label: "Receiver" },
  ];

  const handleSearch = async (): Promise<void> => {
    if (searchTerm.trim().length < 2) {
      showError("Please enter at least 2 characters to search");
      return;
    }

    setIsSearching(true);
    try {
      const users = await crmService.searchUsers(searchTerm);
      setSearchResults(users);
    } catch (error: any) {
      showError("Failed to search CRM users");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddSignatory = (user: any): void => {
    // Check if already added
    const exists = signatories.some((s) => s.crm_user_id === user.id);

    if (exists) {
      showError("User already added as signatory");
      return;
    }

    const newSignatory = {
      crm_user_id: user.id,
      name: user.name,
      role: selectedRole,
      email: user.email,
    };

    onChange([...signatories, newSignatory]);
    setSearchResults([]);
    setSearchTerm("");
    showSuccess("Signatory added successfully");
  };

  const handleRemoveSignatory = (index: number): void => {
    const updated = signatories.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Selected Signatories */}
      {signatories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {signatories.map((signatory, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
            >
              <Badge variant="info" size="sm">
                {signatory.role}
              </Badge>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {signatory.name}
                </p>
                {signatory.email && (
                  <p className="text-xs text-slate-400">{signatory.email}</p>
                )}
              </div>
              <button
                onClick={() => handleRemoveSignatory(index)}
                className="ml-2 text-slate-400 hover:text-rose-600 transition-colors"
              >
                <i className="fas fa-times text-xs" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search and Add */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <Input
              icon="fa-search"
              placeholder="Search CRM users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
          </div>
          <div className="w-40">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500"
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleSearch} isLoading={isSearching}>
            Search
          </Button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {searchResults.map((user) => (
              <button
                key={user.id}
                onClick={() => handleAddSignatory(user)}
                className="w-full flex items-center gap-3 px-3 py-2 bg-white border border-slate-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-purple-600 text-xs" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-slate-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
                <i className="fas fa-plus text-purple-600 text-xs" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignatoryPicker;
