import { useTheme } from '@context/ThemeContext'
import { Moon, SunMedium } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <label className="relative inline-block w-12 h-7 mx-auto">
        <input onClick={toggleTheme}
               type="checkbox"
               className="peer opacity-0 w-0 h-0"/>

        {/*slider*/}
        <span
          className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 inset-shadow-sm
                     bg-default-200 rounded-full transition peer-checked:bg-default-300
                     peer-focus:ring-2 peer-focus:ring-primary/50">
        </span>

        {/*circle*/}
        <span
          className="absolute top-1 left-1 w-5 h-5
                     flex justify-center items-center
                     bg-default-50 rounded-full shadow-sm
                     transition peer-checked:translate-x-5">
          {theme === "dark" ? <Moon/> : <SunMedium/>}
        </span>
      </label>
    </>)
}