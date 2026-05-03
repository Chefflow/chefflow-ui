"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

export default function PrivacyPage() {
  const t = useTranslations("privacy");

  return (
    <div className="min-h-screen bg-secondary/30 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="border-border bg-background shadow-sm">
          <CardHeader className="space-y-2 pb-6 pt-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground">{t("lastUpdated")}</p>
          </CardHeader>

          <CardContent className="space-y-8 pb-8">
            <section className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {t("introduction")}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                {t("dataCollection.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("dataCollection.content")}
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>{t("dataCollection.points.account")}</li>
                <li>{t("dataCollection.points.recipes")}</li>
                <li>{t("dataCollection.points.planning")}</li>
                <li>{t("dataCollection.points.usage")}</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                {t("dataUse.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("dataUse.content")}
              </p>
              <p className="text-muted-foreground leading-relaxed font-medium">
                {t("dataUse.noCommercial")}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                {t("dataSharing.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("dataSharing.content")}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                {t("dataRetention.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("dataRetention.content")}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                {t("security.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("security.content")}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                {t("cookies.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("cookies.content")}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                {t("userRights.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("userRights.content")}
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>{t("userRights.points.access")}</li>
                <li>{t("userRights.points.rectification")}</li>
                <li>{t("userRights.points.deletion")}</li>
                <li>{t("userRights.points.portability")}</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                {t("userRights.contact")}{" "}
                <a
                  href="mailto:diegocaserosmr@gmail.com"
                  className="text-primary hover:underline"
                >
                  diegocaserosmr@gmail.com
                </a>
                {t("userRights.contactSuffix")}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                {t("children.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("children.content")}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                {t("changes.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("changes.content")}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                {t("contact.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("contact.content")}{" "}
                <a
                  href="mailto:diegocaserosmr@gmail.com"
                  className="text-primary hover:underline"
                >
                  diegocaserosmr@gmail.com
                </a>
              </p>
            </section>

            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                {t("footer")}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/" className="text-primary hover:underline text-sm">
            ← {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
