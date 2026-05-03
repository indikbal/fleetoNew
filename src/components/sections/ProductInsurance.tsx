"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ShieldCheck, FileDown } from "lucide-react";
import { colors, fonts } from "@/config/theme";
import type { InsuranceSection } from "@/lib/api";

interface Props {
  data: InsuranceSection;
}

const isImage = (url: string) => /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(url);

function fileNameFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname;
    return decodeURIComponent(path.split("/").pop() || "Document");
  } catch {
    return url.split("/").pop() || "Document";
  }
}

export default function ProductInsurance({ data }: Props) {
  const title = data.insurance_section_title?.trim() ?? "";
  const description = data.insurance_section_description?.trim() ?? "";
  const documents = (data.insurance_section_document ?? []).filter((d) => !!d?.upload);

  if (!title && !description && documents.length === 0) return null;

  return (
    <section
      className="py-16 md:py-24"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="rounded-3xl overflow-hidden shadow-sm"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #FFF5F5 100%)",
            border: "1px solid #F2D4D4",
          }}
        >
          <div className="px-6 md:px-10 py-8 md:py-10">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                }}
              >
                <ShieldCheck size={22} className="text-white" />
              </div>
              {title && (
                <h2
                  className="text-2xl md:text-3xl font-bold leading-tight"
                  style={{ color: colors.black, fontFamily: fonts.display, letterSpacing: "0.5px" }}
                >
                  {title}
                </h2>
              )}
            </div>

            {description && (
              <div
                className="prose prose-sm max-w-none text-gray-600 leading-relaxed mb-6"
                style={{ fontFamily: fonts.body }}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}

            {documents.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc, i) => {
                  const url = doc.upload;
                  const name = fileNameFromUrl(url);
                  return (
                    <motion.a
                      key={`${url}-${i}`}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.05 }}
                      className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all flex flex-col"
                      style={{ border: "1px solid rgba(0,0,0,0.06)" }}
                    >
                      {isImage(url) ? (
                        <div className="relative w-full bg-gray-50" style={{ aspectRatio: "4/3" }}>
                          <Image
                            src={url}
                            alt={name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.02]"
                          />
                        </div>
                      ) : (
                        <div
                          className="flex items-center justify-center bg-gray-50"
                          style={{ aspectRatio: "4/3" }}
                        >
                          <FileDown size={48} style={{ color: colors.primary }} />
                        </div>
                      )}
                      <div
                        className="flex items-center justify-between gap-3 px-4 py-3 border-t"
                        style={{ borderColor: "rgba(0,0,0,0.06)" }}
                      >
                        <span
                          className="text-sm font-semibold text-gray-700 truncate"
                          style={{ fontFamily: fonts.body }}
                          title={name}
                        >
                          {name}
                        </span>
                        <span
                          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider shrink-0"
                          style={{ color: colors.primary, fontFamily: fonts.body }}
                        >
                          <FileDown size={14} /> View
                        </span>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
