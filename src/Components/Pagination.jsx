const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-3 mt-8">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(p => p - 1)}
      >
        Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          style={{
            fontWeight: currentPage === i + 1 ? "bold" : "normal",
          }}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(p => p + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
