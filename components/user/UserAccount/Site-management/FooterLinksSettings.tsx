"use client";

import type { FooterLinkGroup, FooterLinkItem } from "@/types/settings";

interface FooterLinksSettingsProps {
  groups: FooterLinkGroup[];
  onChange: (groups: FooterLinkGroup[]) => void;
  disabled?: boolean;
}

const createItem = (): FooterLinkItem => ({ label: "", url: "" });

export default function FooterLinksSettings({
  groups,
  onChange,
  disabled,
}: FooterLinksSettingsProps) {
  const updateGroup = (groupIndex: number, changes: Partial<FooterLinkGroup>) => {
    onChange(
      groups.map((group, index) =>
        index === groupIndex ? { ...group, ...changes } : group,
      ),
    );
  };

  const updateItem = (
    groupIndex: number,
    itemIndex: number,
    changes: Partial<FooterLinkItem>,
  ) => {
    onChange(
      groups.map((group, index) =>
        index === groupIndex
          ? {
              ...group,
              items: group.items.map((item, currentIndex) =>
                currentIndex === itemIndex ? { ...item, ...changes } : item,
              ),
            }
          : group,
      ),
    );
  };

  return (
    <section className="md:col-span-2 p-6 rounded-2xl border border-custom-gray-200 dark:border-custom-gray-400/20 bg-light/50 dark:bg-dark-700/30 space-y-4">
      <div className="flex items-center justify-between border-b border-custom-gray-200 dark:border-custom-gray-400/20 pb-2">
        <h3 className="text-sm font-bold">لینک‌های فوتر</h3>
        {!disabled && (
          <button
            type="button"
            onClick={() =>
              onChange([...groups, { title: "", items: [createItem()] }])
            }
            className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-medium text-white hover:bg-violet-700"
          >
            + افزودن گروه
          </button>
        )}
      </div>

      {groups.length === 0 ? (
        <p className="py-4 text-center text-xs text-gray-400">
          هیچ گروهی برای فوتر ثبت نشده است.
        </p>
      ) : (
        <div className="space-y-5">
          {groups.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="space-y-3 rounded-xl border border-gray-200 p-3 dark:border-white/10"
            >
              <div className="flex gap-3">
                <input
                  disabled={disabled}
                  value={group.title}
                  onChange={(event) =>
                    updateGroup(groupIndex, { title: event.target.value })
                  }
                  placeholder="عنوان گروه، مثل راهنمای خرید"
                  className="input-info flex-1"
                />
                {!disabled && (
                  <button
                    type="button"
                    onClick={() =>
                      onChange(groups.filter((_, index) => index !== groupIndex))
                    }
                    className="rounded-xl bg-red-50 px-4 text-sm text-red-500 hover:bg-red-500 hover:text-white dark:bg-red-500/10"
                  >
                    حذف گروه
                  </button>
                )}
              </div>

              {group.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex gap-3">
                  <input
                    disabled={disabled}
                    value={item.label}
                    onChange={(event) =>
                      updateItem(groupIndex, itemIndex, {
                        label: event.target.value,
                      })
                    }
                    placeholder="متن لینک"
                    className="input-info flex-1"
                  />
                  <input
                    disabled={disabled}
                    value={item.url}
                    onChange={(event) =>
                      updateItem(groupIndex, itemIndex, {
                        url: event.target.value,
                      })
                    }
                    placeholder="/about-us یا https://..."
                    className="input-info flex-1 ltr"
                  />
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() =>
                        updateGroup(groupIndex, {
                          items: group.items.filter(
                            (_, index) => index !== itemIndex,
                          ),
                        })
                      }
                      className="rounded-xl bg-red-50 px-4 text-sm text-red-500 hover:bg-red-500 hover:text-white dark:bg-red-500/10"
                    >
                      حذف
                    </button>
                  )}
                </div>
              ))}

              {!disabled && (
                <button
                  type="button"
                  onClick={() =>
                    updateGroup(groupIndex, {
                      items: [...group.items, createItem()],
                    })
                  }
                  className="text-xs font-medium text-violet-600 hover:text-violet-700"
                >
                  + افزودن لینک
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
