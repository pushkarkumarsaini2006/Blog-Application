import { useState } from "react";
import Modal from "../../../components/Modal";
import { LuSearch } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const SearchBarPopup = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    if (!query) return;
    setQuery('')
    setIsOpen(false)
    navigate(`/search?query=${query}`);
  };
  return <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} hideHeader>
      <div className="p-4 w-[80vw] md:w-[40vw] mx-auto">
        {/* Header */}
        <h2 className="text-lg font-semibold text-center">Search</h2>

        {/* Search Bar */}
        <div className="relative mt-4 mb-1">
          <input
            type="text"
            value={query}
            onChange={({ target }) => setQuery(target.value)}
            placeholder="Type to search..."
            className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg outline-sky-100"
          />

          <button
            onClick={handleSearch}
            className="w-8 h-8 flex items-center justify-center absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-sky-500 rounded cursor-pointer"
          >
            <LuSearch className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Modal>
};

export default SearchBarPopup;
