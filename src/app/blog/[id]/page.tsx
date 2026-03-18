import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PageHeroBanner from "@/components/ui/PageHeroBanner";
import { colors, fonts, styles } from "@/config/theme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchPost } from "@/lib/api";

interface Props {
  params: Promise<{ id: string }>;
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch { return dateStr; }
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const post = await fetchPost(parseInt(id, 10));
  if (!post) return { title: "Post Not Found — Fleeto" };
  return { title: `${post.title} — Fleeto Blog` };
}

export default async function BlogDetailPage({ params }: Props) {
  const { id } = await params;
  const post = await fetchPost(parseInt(id, 10));
  if (!post) notFound();

  return (
    <>
      <Navbar />
      <PageHeroBanner svgText="BLOG" />
      <main className="pb-20 pt-10 px-4" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-3xl mx-auto">

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6"
            style={{ fontFamily: fonts.body }}
          >
            <ArrowLeft size={15} /> Back to Blog
          </Link>

          <article className="bg-white rounded-3xl overflow-hidden shadow-sm">
            {post.image && (
              <div className="relative w-full" style={{ aspectRatio: "16/7" }}>
                <Image src={post.image} alt={post.title} fill className="object-cover object-center" priority />
              </div>
            )}
            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl leading-tight mb-3" style={{ ...styles.headingFont, color: "#010101" }}>
                {post.title}
              </h2>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: colors.primary, fontFamily: fonts.body }}>
                  {post.author}
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-xs text-gray-400" style={{ fontFamily: fonts.body }}>
                  {formatDate(post.publish_date)}
                </span>
              </div>
              <div className="h-[2px] w-12 rounded-full mb-8" style={{ backgroundColor: colors.primary }} />
              <div
                className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                style={{ fontFamily: fonts.body }}
                dangerouslySetInnerHTML={{ __html: post.description }}
              />
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
