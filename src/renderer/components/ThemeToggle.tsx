import RadioToggle from "@components/helpers/inputs/RadioToggle";
import { Theme, useTheme } from '@context/ThemeContext'
import { LucideIcon, Monitor, Moon, SunMedium } from "lucide-react";

const OPTIONS: { label: string; value: Theme; icon: LucideIcon }[] = [
  { label: 'Light', value: 'light', icon: SunMedium },
  { label: 'System', value: 'system', icon: Monitor },
  { label: 'Dark', value: 'dark', icon: Moon },
]

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <RadioToggle
      name="theme-toggle"
      inputs={OPTIONS.map(({ label, value, icon }) => ({
        label,
        value,
        innerIcon: icon,
        checked: theme === value,
        onChange: () => setTheme(value),
      }))}
    />
  )
}
