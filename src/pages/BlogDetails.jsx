import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const BlogDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fix the absolute WordPress ToC anchor links to in-page links
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

  // Fix the anchor links in the content
  content = fixWordpressAnchors(content);

  return (
    <motion.div
      className="w-full max-w-[60%] mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={`Blog post by ${author}`} />
      </Helmet>

      <Link
        to="/blog"
        className="text-blue-600 hover:underline text-3xl mb-6 inline-block"
      >
        ← Back to Blog
      </Link>

      <h1
        className="text-3xl sm:text-4xl font-bold leading-snug mb-2"
        dangerouslySetInnerHTML={{ __html: title }}
      />

      <p className="text-xl text-gray-500 mb-6">
        By {author} • {date}
      </p>

      {imageUrl && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Render the content with fixed anchors */}
      <div
        className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Custom Styles for Image Captions */}
      <style jsx>{`
        .prose img {
          margin-bottom: 1.5rem;
        }

        .prose figcaption {
          font-size: 0.875rem;
          color: #6b7280;
          text-align: center;
          margin-top: 0.5rem;
          font-style: italic;
        }

        /* Improve spacing between content */
        .prose p {
          margin-bottom: 1.5rem; /* Add space between paragraphs */
          line-height: 1.8; /* Better line height for readability */
        }

        .prose ul, .prose ol {
          margin-bottom: 1.5rem; /* Add space after lists */
        }

        /* Add spacing for blockquotes */
        .prose blockquote {
          border-left: 4px solid #ddd;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #6b7280;
        }

        /* Add spacing between headings and paragraphs */
        .prose h2, .prose h3, .prose h4 {
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .prose h1 {
          margin-top: 3rem;
          margin-bottom: 1rem;
        }
      `}</style>
    </motion.div>
  );
};

export default BlogDetails;
