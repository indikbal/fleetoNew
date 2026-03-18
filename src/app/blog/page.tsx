import Image from "next/image";
import Link from "next/link";
import PageHeroBanner from "@/components/ui/PageHeroBanner";
import { ArrowUpRight } from "lucide-react";
import { colors, fonts } from "@/config/theme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchAllPosts } from "@/lib/api";

export const metadata = {
  title: "Blog — Fleeto",
  description: "News, tips and stories from the Fleeto electric scooter team.",
};

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch { return dateStr; }
}

export default async function BlogsPage() {
  const posts = await fetchAllPosts();

  return (
    <>
      <Navbar />
      <PageHeroBanner svgText="BLOG" />
      <main className="pb-20 pt-10 px-4" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-5xl mx-auto">
          {posts.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-20" style={{ fontFamily: fonts.body }}>
              No posts available yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="group bg-white rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: colors.primary, fontFamily: fonts.body }}>
                        {post.author}
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="text-[10px] text-gray-400" style={{ fontFamily: fonts.body }}>
                        {formatDate(post.date)}
                      </span>
                    </div>
                    <h2 className="text-base font-semibold text-gray-900 mb-2 leading-snug" style={{ fontFamily: fonts.body }}>
                      {post.title}
                    </h2>
                    <p className="text-xs text-gray-400 leading-relaxed flex-1 line-clamp-3" style={{ fontFamily: fonts.body }}>
                      {post.description}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: colors.primary, fontFamily: fonts.body }}>
                      Read More <ArrowUpRight size={13} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
