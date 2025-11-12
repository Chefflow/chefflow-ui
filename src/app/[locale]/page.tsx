import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

export default async function HomePage() {
  const t = await getTranslations("home");
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section - Vercel style */}
      <section className="container mx-auto px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {t("hero.badge")}
          </div>

          <h1 className="mb-6 font-serif text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {t("hero.title")}
          </h1>

          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            {t("hero.subtitle")}
          </p>

          <div className="mb-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button asChild size="lg" className="min-w-[160px]">
              <Link href="/signup">
                {t("hero.getStarted")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[160px]"
            >
              <Link href="/login">{t("hero.signIn")}</Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-primary" />
              <span>{t("hero.feature1")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-primary" />
              <span>{t("hero.feature2")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-primary" />
              <span>{t("hero.feature3")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Notion style grid */}
      <section className="border-y border-border bg-secondary/30 py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-3 font-serif text-3xl font-bold text-foreground sm:text-4xl">
              {t("features.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground">
              {t("features.subtitle")}
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="group border-border bg-background transition-all hover:border-primary/20 hover:shadow-md">
              <CardContent className="flex flex-col items-start gap-4 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">
                    {t("features.saveRecipes.title")}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t("features.saveRecipes.description")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group border-border bg-background transition-all hover:border-primary/20 hover:shadow-md">
              <CardContent className="flex flex-col items-start gap-4 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">
                    {t("features.weeklyPlanning.title")}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t("features.weeklyPlanning.description")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group border-border bg-background transition-all hover:border-primary/20 hover:shadow-md">
              <CardContent className="flex flex-col items-start gap-4 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">
                    {t("features.shoppingList.title")}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t("features.shoppingList.description")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group border-border bg-background transition-all hover:border-primary/20 hover:shadow-md">
              <CardContent className="flex flex-col items-start gap-4 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">
                    {t("features.aiAnalysis.title")}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t("features.aiAnalysis.description")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works - Clean minimal */}
      <section className="py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-3 font-serif text-3xl font-bold text-foreground sm:text-4xl">
              {t("howItWorks.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground">
              {t("howItWorks.subtitle")}
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                1
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                {t("howItWorks.step1.title")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("howItWorks.step1.description")}
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                2
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                {t("howItWorks.step2.title")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("howItWorks.step2.description")}
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                3
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                {t("howItWorks.step3.title")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("howItWorks.step3.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Vercel inspired */}
      <section className="border-t border-border py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {t("cta.badge")}
            </div>

            <h2 className="mb-4 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              {t("cta.title")}
            </h2>

            <p className="mb-8 text-base text-muted-foreground sm:text-lg">
              {t("cta.subtitle")}
            </p>

            <Button asChild size="lg" className="min-w-[160px]">
              <Link href="/signup">
                {t("cta.getStarted")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <p className="mt-4 text-xs text-muted-foreground">
              {t("cta.noCredit")}
            </p>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Image
                src="/chefflow.png"
                alt="ChefFlow"
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <span className="font-semibold text-foreground">ChefFlow</span>
            </div>

            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link
                href="/privacy"
                className="transition-colors hover:text-foreground"
              >
                {t("footer.privacy")}
              </Link>
              <Link
                href="/terms"
                className="transition-colors hover:text-foreground"
              >
                {t("footer.terms")}
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              {t("footer.copyright")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
