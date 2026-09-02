import React, { useState, useEffect } from "react";
import {
  PageHeader,
  Button,
  Input,
  Select,
  Badge,
  LoadingSpinner,
} from "../../../../shared/components/UI";
import { settingsService } from "../../services/settings.service";
import { Setting } from "../../types";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../../../shared/utils/toast";

interface SettingsSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  settings: Setting[];
}

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("general");
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchSettings(activeSection);
  }, [activeSection]);

  const fetchSettings = async (section: string) => {
    setIsLoading(true);
    try {
      const data = await settingsService.getSettings(section);
      setSettings(data);

      // Initialize form data
      const initialData: Record<string, any> = {};
      data.forEach((setting) => {
        initialData[setting.key] = setting.value;
      });
      setFormData(initialData);
    } catch (error: any) {
      showError(error.message || "Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const loadingToast = showLoading("Saving settings...");

    try {
      const settingsToUpdate = settings.map((setting) => ({
        key: setting.key,
        value: formData[setting.key],
        group: setting.group,
        type: setting.type,
        is_public: setting.is_public,
      }));

      await settingsService.updateSettings(settingsToUpdate);

      dismissToast(loadingToast);
      showSuccess("Settings saved successfully");
    } catch (error: any) {
      dismissToast(loadingToast);
      showError(error.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const sections: SettingsSection[] = [
    {
      id: "general",
      title: "General Settings",
      icon: "fa-sliders",
      description: "Configure basic system settings",
      settings: settings.filter((s) => s.group === "general"),
    },
    {
      id: "notifications",
      title: "Notification Settings",
      icon: "fa-bell",
      description: "Manage notification preferences",
      settings: settings.filter((s) => s.group === "notifications"),
    },
    {
      id: "security",
      title: "Security Settings",
      icon: "fa-shield",
      description: "Configure security and authentication",
      settings: settings.filter((s) => s.group === "security"),
    },
    {
      id: "inventory",
      title: "Inventory Settings",
      icon: "fa-boxes-stacked",
      description: "Manage inventory-related settings",
      settings: settings.filter((s) => s.group === "inventory"),
    },
  ];

  const renderSettingInput = (setting: Setting) => {
    switch (setting.type) {
      case "boolean":
        return (
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-900">
                {setting.key
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </label>
              <p className="text-xs text-slate-400 mt-1">
                Enable or disable this feature
              </p>
            </div>
            <button
              onClick={() =>
                handleInputChange(setting.key, !formData[setting.key])
              }
              className={`relative w-12 h-6 rounded-full transition-colors ${
                formData[setting.key] ? "bg-emerald-600" : "bg-slate-200"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  formData[setting.key] ? "left-6" : "left-0.5"
                }`}
              />
            </button>
          </div>
        );

      case "integer":
        return (
          <Input
            label={setting.key
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
            type="number"
            value={formData[setting.key]}
            onChange={(e) =>
              handleInputChange(setting.key, parseInt(e.target.value))
            }
          />
        );

      case "json":
      case "array":
        return (
          <Input
            label={setting.key
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
            type="text"
            value={
              typeof formData[setting.key] === "string"
                ? formData[setting.key]
                : JSON.stringify(formData[setting.key])
            }
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
          />
        );

      default:
        return (
          <Input
            label={setting.key
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
            type="text"
            value={formData[setting.key]}
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
          />
        );
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading settings..." />;
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        icon="fa-gear"
        breadcrumbs={[{ label: "Home" }, { label: "Settings" }]}
        actions={
          <Button onClick={handleSave} isLoading={isSaving} icon="fa-save">
            Save Changes
          </Button>
        }
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600"
                    : "text-slate-600 hover:bg-slate-50 border-l-4 border-transparent"
                }`}
              >
                <i className={`fas ${section.icon} text-xs`} />
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {sections.map((section) => {
            if (section.id !== activeSection) return null;

            return (
              <div key={section.id} className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-1">
                    {section.title}
                  </h2>
                  <p className="text-sm text-slate-500 mb-6">
                    {section.description}
                  </p>

                  {section.settings.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <i className="fas fa-sliders text-3xl mb-3 opacity-40" />
                      <p className="text-sm">
                        No settings available for this section
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {section.settings.map((setting) => (
                        <div
                          key={setting.id}
                          className="pb-6 border-b border-slate-100 last:border-0 last:pb-0"
                        >
                          {renderSettingInput(setting)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
