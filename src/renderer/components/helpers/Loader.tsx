import { Loader2 } from "lucide-react";


export default function Loader() {
  return (
    <div className="flex items-center justify-center gap-2 text-faint text-sm">
      <Loader2 className="w-4 h-4 animate-spin"/>
      Chargement...
    </div>
  )
}