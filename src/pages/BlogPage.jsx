import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Spinner } from "react-bootstrap";

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://navajowhite-gull-167151.hostingersite.com/wp-json/wp/v2/posts?_embed=1"
        );
        if (!res.ok) throw new Error("Failed to load posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <Spinner animation="border" role="status" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-16">
        <p>Oops! Something went wrong. Please try again later.</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>Blog - Political Campaign Management Committee</title>
        <meta
          name="description"
          content="Read the latest news and articles on political campaign management."
        />
      </Helmet>

      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-12">
        Blog Posts
      </h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        {currentPosts.map((post) => {
          const title = post.title.rendered;
          const imageUrl =
            post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";
          const postLink = `/blog/${post.id}`;
          const author = post._embedded?.author?.[0]?.name || "Unknown Author";
          const date = new Date(post.date).toLocaleDateString();

          return (
            <motion.div
              key={post.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Link to={postLink}>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{title}</h2>
                  <p className="text-sm text-gray-500 mb-2">
                    By {author} • {date}
                  </p>
                  <p className="text-gray-700 mb-3 text-sm line-clamp-3">
                    {post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "")}
                  </p>
                  <span className="text-blue-600 font-semibold">
                    Read More →
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Pagination */}
      <div className="mt-12 text-center">
        <div className="flex justify-center items-center gap-6 flex-wrap">
          <motion.button
            onClick={handlePrevPage}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all disabled:opacity-50"
            disabled={currentPage === 1}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Previous
          </motion.button>

          <span className="text-lg font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <motion.button
            onClick={handleNextPage}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all disabled:opacity-50"
            disabled={currentPage === totalPages}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
