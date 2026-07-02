import { Search } from "lucide-react";

const SearchBar = ({ value, onChange }) => {
  return (
    <label className="search-bar">
      <span>Search by title</span>
      <div className="search-bar-input-wrap">
        <Search className="search-bar-icon" size={16} />
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search problems..."
        />
      </div>
    </label>
  );
};

export default SearchBar;
