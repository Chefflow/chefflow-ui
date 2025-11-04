import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("HomePage");
  return (
    <div className="min-h-screen bg-background p-8">
      <main className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-serif font-semibold text-primary mb-4">
          {t("title")}
        </h2>
        <p>
          Go to login page{" "}
          <Link
            href="/login"
            className="inline-block font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
          >
            here
          </Link>
        </p>
        <Image
          src="/chefflow_name.png"
          alt="ChefFlow Logo"
          width={100}
          height={100}
        />
      </main>
    </div>
  );
}
