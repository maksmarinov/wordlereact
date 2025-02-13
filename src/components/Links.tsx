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
    document.addEventListener("mouseup", handleClickOutside);
    return () => document.removeEventListener("mouseup", handleClickOutside);
  }, []);

  return (
    <div className="relative flex justify-start">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 cursor-pointer rounded-md flex flex-row"
        >
          <img src="/assets/links.svg" alt="linksSocials" className="w-5 h-5" />
          Links
        </button>

        {isOpen && (
          <div className="absolute left-full ml-2 top-0 w-40 bg-black shadow-lg rounded-md flex flex-col">
            <div
              onClick={() =>
                window.open(
                  "https://github.com/maksmarinov/wordlereact",
                  "_blank"
                )
              }
              onMouseUp={(e) => e.stopPropagation()}
              className="flex items-center gap-2 px-4 py-2 w-full hover:bg-violet-400 cursor-pointer "
            >
              <img src="/assets/github.svg" alt="GitHub" className="w-5 h-5" />
              GitHub
            </div>
            <div
              onClick={() =>
                window.open(
                  "https://www.linkedin.com/in/maksim-marinov-694b3853/",
                  "_blank"
                )
              }
              onMouseUp={(e) => e.stopPropagation()}
              className="flex items-center gap-2 px-4 py-2 w-full hover:bg-violet-400 cursor-pointer "
            >
              <img
                src="/assets/linkedin.svg"
                alt="LinkedIn"
                className="w-5 h-5"
              />
              LinkedIn
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Links;
