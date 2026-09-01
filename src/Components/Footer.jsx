const Footer = () => {
  return (
    <footer className="mt-20 bg-black border-t-4 border-yellow-400 shadow-[0_-6px_0_#000]">
      <div className="max-w-7xl mx-auto px-4 py-10 text-center">

        <h2 className="text-3xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-blue-500">
          BOOK-TALES
        </h2>

        <p className="mt-3 text-gray-400 font-bold">
          Where Comics & Manga Unite
        </p>

        <div className="mt-6 flex justify-center gap-6 text-gray-400 text-sm">
          <span>© 2025 Book-Tales</span>
          <span>All Heroes Reserved</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;