import { useEffect, useState } from "react";

const useGetWord = () => {
  const [word, setWord] = useState<string>("");
  useEffect(() => {
    const fetchWord = async () => {
      try {
        const res = await fetch(
          "https://words.dev-apis.com/word-of-the-day?random=1"
        );
        const resObj = await res.json();
        setWord(resObj.word.toUpperCase());
      } catch (error) {
        console.error("Error fetching text:", error);
      }
    };
    fetchWord();
  }, []);
  return word;
};
export default useGetWord;
