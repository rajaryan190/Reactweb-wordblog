import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const BlogDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fixWordpressAnchors = (html) => {
    return html.replace(
      /https?:\/\/navajowhite-gull-167151\.hostingersite\.com\/[^#]*#/g,
      '#'
    );
  };

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://navajowhite-gull-167151.hostingersite.com/wp-json/wp/v2/posts/${id}?_embed=1`
        );
        if (!res.ok) throw new Error('Post not found');
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="text-center py-16">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-16">{error}</div>;
  if (!post) return null;

  const title = post.title.rendered;
  let content = post.content.rendered;
  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const author = post._embedded?.author?.[0]?.name || 'Unknown Author';
  const date = new Date(post.date).toLocaleDateString();

  content = fixWordpressAnchors(content);

  return (
    <motion.div
      className="w-full max-w-[90%] md:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={`Blog post by ${author}`} />
      </Helmet>

      <Link
        to="/blog"
        className="text-blue-600 hover:underline text-lg mb-6 inline-block"
      >
        ← Back to Blog
      </Link>

      <h1
        className="text-3xl sm:text-4xl font-bold leading-snug mb-4"
        dangerouslySetInnerHTML={{ __html: title }}
      />

      <p className="text-base text-gray-500 mb-8">
        By {author} • {date}
      </p>

      {imageUrl && (
        <div className="mb-10 rounded-xl overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      <div
        className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none text-gray-900"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <style jsx>{`
        .prose img {
          margin-bottom: 1.5rem;
          border-radius: 8px;
        }

        .prose figcaption {
          font-size: 0.875rem;
          color: #6b7280;
          text-align: center;
          margin-top: 0.5rem;
          font-style: italic;
        }

        .prose p {
          margin-bottom: 1.5rem;
          line-height: 1.8;
        }

        .prose ul,
        .prose ol {
          margin-bottom: 1.5rem;
        }

        .prose blockquote {
          border-left: 4px solid #ddd;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: rgb(106, 111, 122);
        }

        .prose h2,
        .prose h3,
        .prose h4 {
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .prose h1 {
          margin-top: 3rem;
          margin-bottom: 1rem;
        }

        /* Responsive Table */
        .prose table {
          width: 100%;
          border-collapse: collapse;
        }

        .prose th,
        .prose td {
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
        }

        .prose a {
          color: #2563eb;
          text-decoration: underline;
        }

        .prose a:hover {
          color: #1d4ed8;
        }
      `}</style>
    </motion.div>
  );
};

export default BlogDetails;
