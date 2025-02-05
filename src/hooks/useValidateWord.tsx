import { useEffect, useState } from "react";

interface ValidationResult {
  isValid: boolean | null; // null indicates that validation hasn't completed yet
  loading: boolean;
}
const useValidateWord = (wordToValidate: string): ValidationResult => {
  const [isValid, setValid] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const validateWord = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://words.dev-apis.com/validate-word", {
          method: "POST",
          body: JSON.stringify({ word: wordToValidate }),
        });
        const resObj = await res.json();
        setValid(resObj.validWord);
      } catch (error) {
        console.error("Error fetching text:", error);
      } finally {
        setLoading(false);
      }
    };
    validateWord();
  }, [wordToValidate]);
  return { isValid, loading };
};
export default useValidateWord;
