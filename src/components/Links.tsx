import { useState, useRef, useEffect } from "react";

const Links = () => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex justify-end ">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2  cursor-pointer rounded-md flex flex-row"
        >
          <img
            src="/assets/links.svg"
            alt="linksSocials"
            className="w-5 h-5"
          ></img>
          Links
        </button>

        {isOpen && (
          <>
            <div className="absolute right-0 mt-2 w-40 bg-black shadow-lg rounded-md">
              <a
                href="https://github.com/maksmarinov/wordlereact"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 hover:bg-violet-400"
              >
                <img
                  src="/assets/github.svg"
                  alt="GitHub"
                  className="w-5 h-5"
                />{" "}
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/maksim-marinov-694b3853/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-white-500 fill-current hover:bg-violet-400"
              >
                <img
                  src="/assets/linkedin.svg"
                  alt="LinkedIn"
                  className="w-5 h-5"
                />{" "}
                LinkedIn
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Links;
