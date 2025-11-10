import {
  BookOpen,
  Calendar,
  ShoppingCart,
  Sparkles,
  Check,
  ArrowRight,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

export default async function HomePage() {
  const t = await getTranslations("home");
  return (
    <div className="flex min-h-screen flex-col">
      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div className="flex flex-col justify-center space-y-8">
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              {t("hero.badge")}
            </div>
            <div className="space-y-4">
              <h1 className="font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                {t("hero.title")}
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl lg:text-2xl">
                {t("hero.subtitle")}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button asChild size="lg" className="text-base shadow-lg">
                <Link href="/signup">
                  {t("hero.getStarted")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="/login">{t("hero.signIn")}</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>{t("hero.feature1")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>{t("hero.feature2")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>{t("hero.feature3")}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-md rounded-2xl bg-secondary shadow-xl">
              <Image
                src="/chefflow_name.png"
                alt="App hero illustration"
                fill
                className="rounded-2xl object-contain p-8"
                priority
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/30 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold text-foreground sm:text-4xl">
              {t("features.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {t("features.subtitle")}
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
              <CardContent className="flex flex-col items-center space-y-4 p-8 text-center">
                <div className="rounded-xl bg-primary/10 p-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  {t("features.saveRecipes.title")}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("features.saveRecipes.description")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
              <CardContent className="flex flex-col items-center space-y-4 p-8 text-center">
                <div className="rounded-xl bg-primary/10 p-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  {t("features.weeklyPlanning.title")}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("features.weeklyPlanning.description")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
              <CardContent className="flex flex-col items-center space-y-4 p-8 text-center">
                <div className="rounded-xl bg-primary/10 p-4">
                  <ShoppingCart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  {t("features.shoppingList.title")}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("features.shoppingList.description")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
              <CardContent className="flex flex-col items-center space-y-4 p-8 text-center">
                <div className="rounded-xl bg-primary/10 p-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  {t("features.aiAnalysis.title")}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("features.aiAnalysis.description")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold text-foreground sm:text-4xl">
              {t("howItWorks.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {t("howItWorks.subtitle")}
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-3">
            <div className="relative flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 font-serif text-xl font-semibold text-foreground">
                {t("howItWorks.step1.title")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("howItWorks.step1.description")}
              </p>
            </div>
            <div className="relative flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 font-serif text-xl font-semibold text-foreground">
                {t("howItWorks.step2.title")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("howItWorks.step2.description")}
              </p>
            </div>
            <div className="relative flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 font-serif text-xl font-semibold text-foreground">
                {t("howItWorks.step3.title")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("howItWorks.step3.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary/10 via-secondary/50 to-primary/5 py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              {t("cta.badge")}
            </div>
            <h2 className="mb-6 font-serif text-3xl font-bold text-foreground sm:text-5xl">
              {t("cta.title")}
            </h2>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              {t("cta.subtitle")}
            </p>
            <Button asChild size="lg" className="text-base shadow-xl">
              <Link href="/signup">
                {t("cta.getStarted")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="mt-6 text-sm text-muted-foreground">
              {t("cta.noCredit")}
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Image
                src="/chefflow.png"
                alt="ChefFlow"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="font-serif text-lg font-semibold text-foreground">
                ChefFlow
              </span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground">
                {t("footer.privacy")}
              </Link>
              <Link href="/terms" className="hover:text-foreground">
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
