"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth/useAuth";
import { useUpdateProfile } from "@/hooks/useUpdateProfile/useUpdateProfile";

const SLOT_OPTIONS = ["1", "2", "3", "4", "5", "6"] as const;

export const SettingsTab = () => {
  const tSettings = useTranslations("settings");
  const t = useTranslations("settings.planning");
  const { user, isLoading } = useAuth();
  const { updateProfile, isPending } = useUpdateProfile(user?.username);

  const initial = String(user?.slotsPerDay ?? 3);
  const [slotsPerDay, setSlotsPerDay] = useState<string>(initial);

  useEffect(() => {
    if (user?.slotsPerDay) {
      setSlotsPerDay(String(user.slotsPerDay));
    }
  }, [user?.slotsPerDay]);

  if (isLoading || !user) {
    return (
      <>
        <div className="mb-8">
          <Skeleton className="mb-2 h-8 w-48" />
        </div>
        <div className="max-w-2xl">
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </>
    );
  }

  const hasChanges = Number(slotsPerDay) !== user.slotsPerDay;
  const isDisabled = !hasChanges || isPending;

  const handleSave = () => {
    updateProfile({ slotsPerDay: Number(slotsPerDay) });
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {tSettings("title")}
        </h1>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("title")}</CardTitle>
            <CardDescription>{t("slotsPerDayHelp")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="slotsPerDay">{t("slotsPerDay")}</Label>
              <Select value={slotsPerDay} onValueChange={setSlotsPerDay}>
                <SelectTrigger id="slotsPerDay" className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SLOT_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={handleSave} disabled={isDisabled}>
                {t("save")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
