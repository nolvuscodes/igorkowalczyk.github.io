import Avatar from "/public/assets/avatar.png";
import { allBlogs } from "contentlayer/generated";
import { parseISO } from "/lib/utils";
import { meta } from "/config";
import { TocItem } from "components/blog/Toc";
import { MDXComponent } from "components/blog/Components";
import Image from "next/image";
import Link from "next/link";
import "styles/blog.css";
import { notFound } from "next/navigation";

export const runtime = "edge";

export async function generateStaticParams() {
 return allBlogs.map((post) => ({
  slug: post.slug,
 }));
}

export async function generateMetadata({ params }) {
 const post = allBlogs.find((post) => post?.slug === params?.slug);

 if (!post) {
  return;
 }

 const { title, publishedAt: publishedTime, summary: description, image, slug } = post;
 const ogImage = image ? `${meta.url}${image}` : `${meta.url}/api/og?title=${title}&date=${publishedTime}`;

 return {
  title,
  description,
  openGraph: {
   title,
   description,
   type: "article",
   publishedTime,
   url: `${meta.url}/blog/${slug}`,
   images: [
    {
     url: ogImage,
     width: 1200,
     height: 630,
    },
   ],
  },
  twitter: {
   card: "summary_large_image",
   title,
   description,
   images: [ogImage],
  },
 };
}

export default function Post({ params }) {
 const post = allBlogs.find((post) => post?.slug === params?.slug);

 if (!post) {
  return notFound();
 }

 return (
  <article className="mx-auto mb-16 flex min-h-screen w-full max-w-2xl flex-col items-start justify-center">
   <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
     __html: JSON.stringify(post?.structuredData),
    }}
   />
   <div className="prose grid flex-1 grid-cols-1 gap-x-8 font-inter dark:prose-dark md:grid-cols-[1fr,minmax(auto,640px),1fr] md:[&>*]:col-start-2">
    <div>
     <header className="w-full font-inter">
      <h1 className="mb-2 mt-6 flex items-center box-decoration-clone bg-clip-text font-inter text-[2.5rem] font-semibold motion-reduce:transition-none">
       {post?.title}
       <span className="bg-gradient-to-r from-[#6310ff] to-[#1491ff] box-decoration-clone bg-clip-text text-fill-transparent dark:from-[#a2facf] dark:to-[#64acff]">.</span>
      </h1>
      <div className="mt-2 flex w-full flex-col items-start justify-between md:flex-row md:items-center">
       <div>
        <div className="flex items-center">
         <Image alt={meta?.title} height={24} width={24} src={Avatar} className="rounded-full" />
         <time className="ml-2 text-sm text-gray-700 dark:text-gray-300" dateTime={new Date(post?.publishedAt).toUTCString()}>
          {post?.author} / {parseISO(post?.publishedAt)}
         </time>
        </div>
       </div>
       <p className="min-w-32 mt-2 text-sm text-gray-600 dark:text-gray-400 md:mt-0">
        {post?.wordCount} words • {post?.readingTime?.text}
       </p>
      </div>
     </header>
     <MDXComponent code={post.body.code} />
    </div>
    <div className="sticky top-24 !col-start-3 ml-3 mt-8 hidden max-w-[14rem] flex-col space-y-2 self-start text-base xl:flex">
     <p className="mb-0 text-sm uppercase">On this page</p>
     {post?.headings?.map((props) => (
      <TocItem key={props?.slug} {...props} />
     ))}
    </div>
   </div>
   <div className="flex w-full justify-end py-4 font-inter text-gray-700 dark:text-gray-300">
    <Link href={`https://github.com/${meta.accounts.github.username}/${meta.accounts.github.repo}/blob/master/data/blog/${post.slug}.mdx`} target="_blank" rel="noopener noreferrer">
     Suggest a change
    </Link>
   </div>
  </article>
 );
}
