import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-gray-400">PCMC</Link>
        <Link to="/blog" className="text-lg hover:text-gray-400">Blog</Link>
      </div>
    </nav>
  );
};

export default Navbar;
